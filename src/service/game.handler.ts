import { GameState } from "../model/game.model";
import { v4 as uuidv4 } from "uuid";
import service from "./game.service";
import { Participant } from "../model/participant.model";
import { Role } from "../model/role.model";
import { JoinPayload } from "../model/join.payload";
import { JoinEvent } from "../event/join.event";
import jwt from "../auth/jwt.manager";
import {
  INCORRECT_PASSWORD,
  ROOM_FULL,
  NOT_FOUND,
  NICK_TAKEN,
} from "../error/error.util";
import { WordType } from "../model/word.type";
import { Team } from "../model/team.model";
import { CreateGamePayload } from "../model/create-game.payload";
import { WordClicked } from "../model/word.clicked.payload";
import { PlayerAction } from "../model/player.action.payload";
import { GameEvent } from "../event/game.event";
import log from "../config/log";
const REQUESTOR = "GAME_HANDLER";

const rooms: Map<string, GameState> = new Map<string, GameState>();

const createGame = (
  nick: string,
  password: string,
  maxPlayers: number
): string => {
  const room = uuidv4();
  return jwt.generateJwt({
    room,
    nick,
    password,
    maxPlayers,
  });
};

const joinGame = (joinPayload: JoinPayload): string => {
  // Find game
  const state = getGame(joinPayload.room);
  // Check password
  if (state.password !== joinPayload.password) {
    throw new Error(INCORRECT_PASSWORD);
  } // Verify room has more slots
  if (state.participants.length >= state.maxPlayers) {
    throw new Error(ROOM_FULL);
  } // Check nick availability
  for (let player of state.participants) {
    if (player.nick === joinPayload.nick) {
      throw new Error(NICK_TAKEN);
    }
  } // Generate token
  return jwt.generateJwt(joinPayload);
};

const onCreateGame = (
  socketId: string,
  joinPayload: CreateGamePayload
): GameState => {
  const state = service.createGame(
    joinPayload.password,
    joinPayload.maxPlayers
  );
  const newParticipant: Participant = {
    id: socketId,
    nick: joinPayload.nick,
    team: service.getRandomTeam(),
    role: Role.OPERATIVE,
  };
  state.participants.push(newParticipant);
  changePlayersCount(newParticipant, state);
  rooms.set(joinPayload.room, state);
  log.info(REQUESTOR, `Room ${joinPayload.room} created`);
  return state;
};

const onJoinGame = (socketId: string, joinPayload: JoinPayload): JoinEvent => {
  // Get room
  const state = getGame(joinPayload.room);
  // Verify room existence and password validity
  if (!state || state.password !== joinPayload.password) {
    throw new Error(NOT_FOUND);
  }
  // Create participant
  const newParticipant: Participant = {
    id: socketId,
    nick: joinPayload.nick,
    team: service.assignTeam(
      state.participants.length,
      state.blueTeamPlayers,
      state.redTeamPlayers
    ),
    role: Role.OPERATIVE,
  };
  state.participants.push(newParticipant);
  changePlayersCount(newParticipant, state);
  return { state, joined: newParticipant };
};

const onNewGame = (room: string): GameState => {
  // Get room
  const state = getGame(room);
  clearTimer(state);
  // Get new game
  const newGame = service.newGame({
    ...state,
    roomId: room,
  });
  rooms.set(room, newGame);
  console.log("blue players - " + newGame.blueTeamPlayers);
  console.log("red players - " + newGame.redTeamPlayers);
  console.log("here");
  return newGame;
};

const onWordClick = (
  wordIndex: number,
  socketId: string,
  room: string
): WordClicked | null => {
  // Get game state
  const state = getGame(room);
  // Get word clicked
  const word = state.words[wordIndex];
  // Get clicking player
  const player = getPlayer(socketId, state);
  if (
    word.selected || // Check if word is already selected
    player.team !== state.currentTeam || // Check if clicking player is in current selecting team
    player.role !== Role.OPERATIVE || // Check if selecting player is operative
    state.blueTeamPoints === 0 || // Either of the points is 0
    state.redTeamPoints === 0 ||
    state.winningTeam
  ) {
    return null;
  }
  // Set word clicked
  word.selected = true;
  // Return word event according to word type and word - player relation
  switch (word.type) {
    case WordType.BLUE:
      state.blueTeamPoints -= 1;
      if (player.team !== Team.SAPPHIRE) {
        changeTurn(state);
      }
      break;
    case WordType.RED:
      state.redTeamPoints -= 1;
      if (player.team !== Team.RUBY) {
        changeTurn(state);
      }
      break;
    case WordType.NEUTRAL:
      changeTurn(state);
      break;
    case WordType.BOMB:
      const winningTeam = otherTeam(player.team);
      winGame(state, winningTeam);
      return { wordIndex, winningTeam };
  }
  const gameWon = state.blueTeamPoints === 0 || state.redTeamPoints === 0;
  if (gameWon) {
    const winningTeam = state.blueTeamPoints === 0 ? Team.SAPPHIRE : Team.RUBY;
    winGame(state, winningTeam);
    return { wordIndex, winningTeam };
  }
  return { wordIndex };
};

const winGame = (state: GameState, winningTeam: Team): void => {
  state.winningTeam = winningTeam;
  clearTimer(state, true);
};

const onRoleChange = (socketId: string, room: string): string => {
  // Get game state
  const state = getGame(room);
  // Get clicking player
  const player = getPlayer(socketId, state);
  // Change player role
  player.role = otherRole(player.role);
  // Return player id
  return socketId;
};

const onTeamChange = (socketId: string, room: string): string => {
  // Get game state
  const state = getGame(room);
  // Get clicking player
  const player = getPlayer(socketId, state);
  // Change player team
  player.team = otherTeam(player.team);
  // Return player id
  return socketId;
};

const onTimerSet = (room: string, timeSpan: number, io: any): number => {
  // Get game state
  const state = getGame(room);
  // Set game timer
  state.turnTime = timeSpan;
  state.currentTime = state.turnTime;
  // Clear timer interval
  clearTimer(state);
  if (timeSpan > 0) {
    state.turnInterval = setInterval(() => {
      state.currentTime--;
      if (state.currentTime >= 0) {
        // Timer ticking
        io.to(room).emit(GameEvent.TIME_TICK, state.currentTime);
      } else {
        // TimeOut - reset timer and change turn
        changeTurn(state);
        io.to(room).emit(GameEvent.CHANGE_TURN, state.currentTeam);
      }
    }, 1000);
  }
  // Return new time span
  return timeSpan;
};

const onEndTurn = (socketId: string, room: string): Team | null => {
  // Get game state
  const state = getGame(room);
  // Get clicking player
  const player = getPlayer(socketId, state);
  // Check turn ending permissions
  if (player.team !== state.currentTeam || player.role === Role.SPY_MASTER) {
    return null;
  } // Change turn
  return changeTurn(state);
};

const clearTimer = (state: GameState, erase: boolean = false): void => {
  if (state.turnInterval) {
    clearInterval(state.turnInterval);
  }
  if (erase) {
    state.turnTime = 0;
    state.currentTime = 0;
  }
};

const onDisconnectGame = (
  socketId: string,
  room: string
): PlayerAction | null => {
  // Fetch game
  const game = rooms.get(room);
  if (game) {
    const index = game.participants.findIndex(
      (participant) => participant.id === socketId
    ); // Find and remove participant
    if (index !== -1) {
      const player = game.participants[index];
      game.participants.splice(index, 1);
      changePlayersCount(player, game, true);
      if (game.participants.length === 0) {
        // Remove game upon 0 participants
        clearTimer(game, true);
        rooms.delete(room);
        log.info(REQUESTOR, `Room ${room} removed`);
        return null;
      }
      return {
        nick: player.nick,
        updatedPlayers: Array.from(game.participants),
      };
    }
  }
  return null;
};

const changeTurn = (room: GameState): Team => {
  // change current turn
  room.currentTeam = otherTeam(room.currentTeam);
  // Reset timer if exists
  if (room.turnTime) {
    room.currentTime = room.turnTime;
  }
  return room.currentTeam;
};

const getGame = (room: string): GameState => {
  // Get room
  const state = rooms.get(room);
  // Verify room existence and password validity
  if (!state) {
    throw new Error(NOT_FOUND);
  } // Return game state
  return state;
};

const getPlayer = (playerId: string, game: GameState): Participant => {
  const player = game.participants.find(
    (participant) => participant.id === playerId
  );
  if (!player) {
    throw new Error(NOT_FOUND);
  }
  return player;
};

const otherTeam = (team: Team): Team => {
  return team === Team.SAPPHIRE ? Team.RUBY : Team.SAPPHIRE;
};

const otherRole = (role: Role): Role => {
  return role === Role.OPERATIVE ? Role.SPY_MASTER : Role.OPERATIVE;
};

const changePlayersCount = (
  player: Participant,
  game: GameState,
  decrease: boolean = false
): void => {
  player.team === Team.SAPPHIRE
    ? decrease
      ? game.blueTeamPlayers--
      : game.blueTeamPlayers++
    : decrease
    ? game.redTeamPlayers--
    : game.redTeamPlayers++;
};

export default {
  createGame,
  joinGame,
  onCreateGame,
  onJoinGame,
  onWordClick,
  onRoleChange,
  onTeamChange,
  onTimerSet,
  onNewGame,
  onEndTurn,
  onDisconnectGame,
};
