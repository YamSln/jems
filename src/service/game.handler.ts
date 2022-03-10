import { GameState } from "../model/game.model";
import { v4 as uuidv4 } from "uuid";
import service from "./game.service";
import { Participant } from "../model/participant.model";
import { Role } from "../model/role.model";
import { JoinPayload } from "../model/join.payload";
import { JoinEvent } from "../event/join.event";
import jwt from "../auth/jwt.manager";
import { INCORRECT_PASSWORD, ROOM_FULL, NOT_FOUND } from "../error/error.util";
import { WordType } from "../model/word.type";
import { Team } from "../model/team.model";
import { CreateGamePayload } from "../model/create-game.payload";
import { WordClicked } from "../model/word.clicked.payload";

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
  } // Generate token
  return jwt.generateJwt(joinPayload);
};

const onCreateGame = (
  socketId: string,
  joinPayload: CreateGamePayload
): GameState => {
  const gameState = service.createGame(
    joinPayload.password,
    joinPayload.maxPlayers
  );
  const newParticipant: Participant = {
    id: socketId,
    nick: joinPayload.nick,
    team: service.getRandomTeam(),
    role: Role.OPERATIVE,
  };
  gameState.participants.push(newParticipant);
  rooms.set(joinPayload.room, gameState);
  return gameState;
};

const onJoinGame = (socketId: string, joinPayload: JoinPayload): JoinEvent => {
  // Get room
  const state = getGame(joinPayload.room);
  // Verify room existence and password validity
  if (!state || state.password !== joinPayload.password) {
    throw new Error(NOT_FOUND);
  } // Create participant
  const newParticipant: Participant = {
    id: socketId,
    nick: joinPayload.nick,
    team: service.getRandomTeam(),
    role: Role.OPERATIVE,
  };
  state.participants.push(newParticipant);
  return { state, joined: newParticipant };
};

const onNewGame = (room: string): GameState => {
  // Get room
  const state = getGame(room);
  // Get new game
  const newGame = service.newGame({ ...state, roomId: room });
  rooms.set(room, newGame);
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
      if (player.team === Team.SAPPHIRE) {
        state.blueTeamPoints -= 1;
      } else {
        state.redTeamPoints -= 1;
        changeTurn(state);
      }
      break;
    case WordType.RED:
      if (player.team === Team.RUBY) {
        state.redTeamPoints -= 1;
      } else {
        state.blueTeamPoints -= 1;
        changeTurn(state);
      }
      break;
    case WordType.NEUTRAL:
      changeTurn(state);
      break;
    case WordType.BOMB:
      const winningTeam =
        player.team === Team.SAPPHIRE ? Team.RUBY : Team.SAPPHIRE;
      return { wordIndex, winningTeam };
  }
  const gameWon = state.blueTeamPoints === 0 || state.redTeamPoints === 0;
  if (gameWon) {
    const winningTeam = state.blueTeamPoints === 0 ? Team.SAPPHIRE : Team.RUBY;
    return { wordIndex, winningTeam };
  }
  return { wordIndex };
};

const onRoleChange = (socketId: string, room: string): string => {
  // Get game state
  const state = getGame(room);
  // Get clicking player
  const player = getPlayer(socketId, state);
  // Change player role
  player.role =
    player.role === Role.OPERATIVE ? Role.SPY_MASTER : Role.OPERATIVE;
  // Return player id
  return socketId;
};

const onTeamChange = (socketId: string, room: string): string => {
  // Get game state
  const state = getGame(room);
  // Get clicking player
  const player = getPlayer(socketId, state);
  // Change player team
  player.team = player.team === Team.SAPPHIRE ? Team.RUBY : Team.SAPPHIRE;
  // Return player id
  return socketId;
};

const onTimerSet = (room: string, timeSpan: number): number => {
  // Get game state
  const state = getGame(room);
  // Set game timer
  state.turnTime = timeSpan;
  // Return new time span
  return timeSpan;
};

const onDisconnectGame = (socketId: string, room: string): string | null => {
  const game = rooms.get(room);
  if (game) {
    const index = game.participants.findIndex(
      (participant) => participant.id === socketId
    );
    if (index !== -1) {
      game.participants.splice(index, 1);
      return room;
    }
  }
  return null;
};

const changeTurn = (room: GameState): void => {
  // change current turn
  room.currentTeam =
    room.currentTeam === Team.SAPPHIRE ? Team.RUBY : Team.SAPPHIRE;
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
  onDisconnectGame,
};
