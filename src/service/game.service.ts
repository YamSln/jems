import { Game, GamePack, GameState } from "../model/game.model";
import { v4 as uuidv4 } from "uuid";
import { Player } from "../model/player.model";
import { Role } from "../model/role.model";
import { JoinPayload } from "../payload/join.payload";
import { JoinEvent } from "../event/join.event";
import jwt from "../auth/jwt.manager";
import {
  INCORRECT_PASSWORD,
  ROOM_FULL,
  NOT_FOUND,
  NICK_TAKEN,
  TEAM_FULL,
} from "../error/error.util";
import { WordType } from "../model/word.type";
import { Team } from "../model/team.model";
import { CreateGamePayload } from "../payload/create-game.payload";
import { WordClicked } from "../payload/word.clicked.payload";
import { PlayerAction } from "../payload/player.action.payload";
import { GameEvent } from "../event/game.event";
import { MAXIMUM_MAX_PLAYERS } from "../util/game.constants";
import { WordPackCollection, WordPackFile } from "../model/word-pack.model";

import helper from "./game.helper";
import repository from "../database/game.repository";
import log from "../log/log";

const REQUESTOR = "GAME_SERVICE";

const createGame = (
  nick: string,
  password: string,
  maxPlayers: number,
  wordPackFiles: WordPackFile[],
): string => {
  const room = uuidv4();
  // Keep word packs if exists
  if (wordPackFiles && wordPackFiles.length > 0) {
    const wordPackCollection: WordPackCollection = {
      timeStamp: Date.now(),
      wordPackFiles,
    };
    repository.setWordPackCollection(room, wordPackCollection);
  }
  return jwt.generateJwt({
    room,
    nick,
    password,
    maxPlayers,
  });
};

const joinGame = (joinPayload: JoinPayload): string => {
  const state = getGame(joinPayload.room);
  if (state.password !== joinPayload.password) {
    throw new Error(INCORRECT_PASSWORD);
  } // Verify room has more slots
  if (state.players.length >= state.maxPlayers) {
    throw new Error(ROOM_FULL);
  } // Check nick availability
  for (const player of state.players) {
    if (player.nick === joinPayload.nick) {
      throw new Error(NICK_TAKEN);
    }
  } // Generate token
  return jwt.generateJwt(joinPayload);
};

const onCreateGame = (
  socketId: string,
  joinPayload: CreateGamePayload,
): Game => {
  const state = helper.createGame(
    joinPayload.password,
    joinPayload.maxPlayers,
    repository.defaultWordsSource(),
  );
  const newPlayer: Player = {
    id: socketId,
    nick: joinPayload.nick,
    team: helper.getRandomTeam(),
    role: Role.JEMOLOGIST,
  };
  // Add the creator to the game and increase players count
  state.players.push(newPlayer);
  changePlayersCount(newPlayer, state);
  repository.setGame(joinPayload.room, state);
  log.info(REQUESTOR, `Room ${joinPayload.room} created`);
  const { password, turnInterval, ...game } = state;
  return game;
};

const onJoinGame = (socketId: string, joinPayload: JoinPayload): JoinEvent => {
  const state = getGame(joinPayload.room);
  // Verify room existence and password validity
  if (!state || state.password !== joinPayload.password) {
    throw new Error(NOT_FOUND);
  }
  // Create player
  const newPlayer: Player = {
    id: socketId,
    nick: joinPayload.nick,
    team: helper.assignTeam(
      state.players.length,
      state.sapphirePlayers,
      state.rubyPlayers,
    ),
    role: Role.JEMOLOGIST,
  };
  // Add joined player to the game and increase players count
  state.players.push(newPlayer);
  changePlayersCount(newPlayer, state);
  const { password, turnInterval, ...game } = state;
  return { state: game, joined: newPlayer };
};

const onNewGame = (room: string, wordPackIndex?: number): Game => {
  const gamePack =
    wordPackIndex != null ? updateGame(room, wordPackIndex) : getGamePack(room);
  const newGame = helper.newGame(
    {
      ...gamePack.state,
      roomId: room,
    },
    gamePack.wordsSource,
  );
  repository.setGame(room, newGame);
  const { password, turnInterval, ...game } = newGame;
  return game;
};

const onWordClick = (
  wordIndex: number,
  socketId: string,
  room: string,
): WordClicked | null => {
  const state = getGame(room);
  const word = state.words[wordIndex];
  const player = getPlayer(socketId, state);
  if (
    !word ||
    word.selected || // Check if word is already selected
    player.team !== state.currentTeam || // Check if clicking player is in current selecting team
    player.role !== Role.JEMOLOGIST || // Check if selecting player is jemologist
    state.sapphirePoints === 0 || // Either of the points is 0
    state.rubyPoints === 0 ||
    state.winningTeam
  ) {
    return null;
  }

  word.selected = true;

  switch (word.type) {
    case WordType.SAPPHIRE:
      state.sapphirePoints -= 1;
      if (player.team !== Team.SAPPHIRE) {
        changeTurn(state);
      }
      break;
    case WordType.RUBY:
      state.rubyPoints -= 1;
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
  } // Check if game was won after current operation
  const gameWon = state.sapphirePoints === 0 || state.rubyPoints === 0;
  if (gameWon) {
    const winningTeam = state.sapphirePoints === 0 ? Team.SAPPHIRE : Team.RUBY;
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
  const state = getGame(room);
  const player = getPlayer(socketId, state);
  player.role = otherRole(player.role);
  return socketId;
};

const onTeamChange = (socketId: string, room: string): string => {
  const state = getGame(room);
  const player = getPlayer(socketId, state);
  if (player.team === Team.SAPPHIRE) {
    if (state.rubyPlayers >= MAXIMUM_MAX_PLAYERS / 2 + 1) {
      throw new Error(TEAM_FULL);
    }
  } else if (state.sapphirePlayers >= MAXIMUM_MAX_PLAYERS / 2 + 1) {
    throw new Error(TEAM_FULL);
  }
  player.team = otherTeam(player.team);
  changePlayersCount(player, state, false, true);
  return socketId;
};

const onTimerSet = (room: string, timeSpan: number, io: any): number => {
  const state = getGame(room);
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
  return timeSpan;
};

const onEndTurn = (socketId: string, room: string): Team | null => {
  const state = getGame(room);
  const player = getPlayer(socketId, state);
  if (player.team !== state.currentTeam || player.role === Role.JEM_MASTER) {
    return null;
  }
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
  room: string,
): PlayerAction | null => {
  const game = repository.getGame(room);
  if (game) {
    // Find and remove player, decrease players count
    const index = game.players.findIndex((player) => player.id === socketId);
    if (index !== -1) {
      const player = game.players[index];
      game.players.splice(index, 1);
      changePlayersCount(player, game, true);
      if (game.players.length === 0) {
        // Remove game upon 0 players
        clearTimer(game, true);
        repository.removeGame(room);
        log.info(REQUESTOR, `Room ${room} removed`);
        return null;
      }
      return {
        nick: player.nick,
        updatedPlayers: Array.from(game.players),
      };
    }
  }
  return null;
};

const changeTurn = (room: GameState): Team => {
  room.currentTeam = otherTeam(room.currentTeam);
  // Reset timer if exists
  if (room.turnTime) {
    room.currentTime = room.turnTime;
  }
  return room.currentTeam;
};

const getGamePack = (room: string): GamePack => {
  const gamePackCollection = repository.getGamePack(room);
  if (!gamePackCollection) {
    throw new Error(NOT_FOUND);
  }
  return gamePackCollection;
};

const getGame = (room: string): GameState => {
  const game = repository.getGame(room);
  if (!game) {
    throw new Error(NOT_FOUND);
  }
  return game;
};

const getPlayer = (playerId: string, game: GameState): Player => {
  const player = game.players.find((p) => p.id === playerId);
  if (!player) {
    throw new Error(NOT_FOUND);
  }
  return player;
};

const updateGame = (room: string, wordPackIndex: number): GamePack => {
  const gamePack = repository.updateGamePack(room, wordPackIndex);
  if (!gamePack) {
    throw new Error(NOT_FOUND);
  }
  return gamePack;
};

const otherTeam = (team: Team): Team => {
  return team === Team.SAPPHIRE ? Team.RUBY : Team.SAPPHIRE;
};

const otherRole = (role: Role): Role => {
  return role === Role.JEMOLOGIST ? Role.JEM_MASTER : Role.JEMOLOGIST;
};

const changePlayersCount = (
  player: Player,
  game: GameState,
  decrease: boolean = false,
  teamChange: boolean = false,
): void => {
  if (player.team === Team.SAPPHIRE) {
    decrease ? game.sapphirePlayers-- : game.sapphirePlayers++;
    teamChange ? game.rubyPlayers-- : undefined;
  } else {
    decrease ? game.rubyPlayers-- : game.rubyPlayers++;
    teamChange ? game.sapphirePlayers-- : undefined;
  }
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

export const handlerTest = {
  getGame,
};
