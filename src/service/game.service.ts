import { Game, GamePack, GameState } from "../model/game.model";
import { v4 as uuidv4 } from "uuid";
import { Player } from "../model/player.model";
import { Role } from "../model/role.model";
import { JoinPayload } from "../payload/join.payload";
import { JoinEvent, GameEvent } from "../event";
import { jwtManager } from "../auth";
import {
  INCORRECT_PASSWORD,
  ROOM_FULL,
  NOT_FOUND,
  NICK_TAKEN,
  TEAM_FULL,
} from "../error";
import { WordType } from "../model/word.type";
import { Team } from "../model/team.model";
import { CreateGamePayload } from "../payload/create-game.payload";
import { WordClicked } from "../payload/word.clicked.payload";
import { PlayerAction } from "../payload/player.action.payload";
import { MAXIMUM_MAX_PLAYERS } from "../util/game.constants";
import { WordPack } from "../model/word-pack.model";
import { log } from "../log";
import { Word } from "../model/word.model";

import gamePackService from "./game-pack.service";
import helper from "./game.helper";

const REQUESTOR = "GAME_SERVICE";

function createGame(
  nick: string,
  password: string,
  maxPlayers: number,
  wordPacks: WordPack[],
): string {
  const room: string = uuidv4();
  // Keep word packs if exists
  if (wordPacks && wordPacks.length > 0) {
    gamePackService.setWordPackCollection(room, Date.now(), wordPacks);
  }
  return jwtManager.generateJwt({
    room,
    nick,
    password,
    maxPlayers,
  });
}

function joinGame(joinPayload: JoinPayload): string {
  const gameState: GameState = gamePackService.getGame(joinPayload.room);
  if (gameState.password !== joinPayload.password) {
    throw new Error(INCORRECT_PASSWORD);
  } // Verify room has more slots
  if (gameState.players.length >= gameState.maxPlayers) {
    throw new Error(ROOM_FULL);
  } // Check nick availability
  for (const player of gameState.players) {
    if (player.nick === joinPayload.nick) {
      throw new Error(NICK_TAKEN);
    }
  } // Generate token
  return jwtManager.generateJwt(joinPayload);
}

function onCreateGame(socketId: string, joinPayload: CreateGamePayload): Game {
  const gameState: GameState = helper.createGame(
    joinPayload.password,
    joinPayload.maxPlayers,
    gamePackService.defaultWordsSource(),
  );
  const newPlayer: Player = {
    id: socketId,
    nick: joinPayload.nick,
    team: helper.getRandomTeam(),
    role: Role.JEMOLOGIST,
  };
  // Add the creator to the game and increase players count
  gameState.players.push(newPlayer);
  changePlayersCount(newPlayer, gameState);
  gamePackService.setGamePack(joinPayload.room, gameState);
  log.info(REQUESTOR, `Room ${joinPayload.room} created`);
  const { password, turnInterval, ...game } = gameState;
  return game;
}

function onJoinGame(socketId: string, joinPayload: JoinPayload): JoinEvent {
  const gameState: GameState = gamePackService.getGame(joinPayload.room);
  // Verify room existence and password validity
  if (gameState.password !== joinPayload.password) {
    throw new Error(NOT_FOUND);
  }
  // Create player
  const newPlayer: Player = {
    id: socketId,
    nick: joinPayload.nick,
    team: helper.assignTeam(
      gameState.players.length,
      gameState.sapphirePlayers,
      gameState.rubyPlayers,
    ),
    role: Role.JEMOLOGIST,
  };
  // Add joined player to the game and increase players count
  gameState.players.push(newPlayer);
  changePlayersCount(newPlayer, gameState);
  const { password, turnInterval, ...state } = gameState;
  return { state, joined: newPlayer };
}

function onNewGame(room: string, wordPackIndex?: number): Game {
  const gamePack: GamePack =
    wordPackIndex != null
      ? gamePackService.updateGamePack(room, wordPackIndex)
      : gamePackService.getGamePack(room);
  const newGame: GameState = helper.newGame(
    {
      ...gamePack.gameState,
      roomId: room,
    },
    gamePack.wordsSource,
  );
  gamePackService.setGamePack(room, newGame);
  const { password, turnInterval, ...game } = newGame;
  return game;
}

function onWordClick(
  wordIndex: number,
  socketId: string,
  room: string,
): WordClicked | null {
  const gameState: GameState = gamePackService.getGame(room);
  const word: Word = gameState.words[wordIndex];
  const player: Player = getPlayer(socketId, gameState);
  if (
    !word ||
    word.selected || // Check if word is already selected
    player.team !== gameState.currentTeam || // Check if clicking player is in current selecting team
    player.role !== Role.JEMOLOGIST || // Check if selecting player is jemologist
    gameState.sapphirePoints === 0 || // Either of the points is 0
    gameState.rubyPoints === 0 ||
    gameState.winningTeam
  ) {
    return null;
  }

  word.selected = true;

  switch (word.type) {
    case WordType.SAPPHIRE:
      gameState.sapphirePoints -= 1;
      if (player.team !== Team.SAPPHIRE) {
        changeTurn(gameState);
      }
      break;
    case WordType.RUBY:
      gameState.rubyPoints -= 1;
      if (player.team !== Team.RUBY) {
        changeTurn(gameState);
      }
      break;
    case WordType.NEUTRAL:
      changeTurn(gameState);
      break;
    case WordType.BOMB:
      const winningTeam: Team = otherTeam(player.team);
      winGame(gameState, winningTeam);
      return { wordIndex, winningTeam };
  } // Check if game was won after current operation
  const gameWon: boolean =
    gameState.sapphirePoints === 0 || gameState.rubyPoints === 0;
  if (gameWon) {
    const winningTeam: Team =
      gameState.sapphirePoints === 0 ? Team.SAPPHIRE : Team.RUBY;
    winGame(gameState, winningTeam);
    return { wordIndex, winningTeam };
  }
  return { wordIndex };
}

function winGame(gameState: GameState, winningTeam: Team): void {
  gameState.winningTeam = winningTeam;
  clearTimer(gameState, true);
}

function onRoleChange(socketId: string, room: string): string {
  const gameState: GameState = gamePackService.getGame(room);
  const player: Player = getPlayer(socketId, gameState);
  player.role = otherRole(player.role);
  return socketId;
}

function onTeamChange(socketId: string, room: string): string {
  const gameState: GameState = gamePackService.getGame(room);
  const player: Player = getPlayer(socketId, gameState);
  if (player.team === Team.SAPPHIRE) {
    if (gameState.rubyPlayers >= MAXIMUM_MAX_PLAYERS / 2 + 1) {
      throw new Error(TEAM_FULL);
    }
  } else if (gameState.sapphirePlayers >= MAXIMUM_MAX_PLAYERS / 2 + 1) {
    throw new Error(TEAM_FULL);
  }
  player.team = otherTeam(player.team);
  changePlayersCount(player, gameState, false, true);
  return socketId;
}

function onTimerSet(room: string, timeSpan: number, io: any): number {
  const gameState: GameState = gamePackService.getGame(room);
  gameState.turnTime = timeSpan;
  gameState.currentTime = gameState.turnTime;
  // Clear timer interval
  clearTimer(gameState);
  if (timeSpan > 0) {
    gameState.turnInterval = setInterval(() => {
      gameState.currentTime--;
      if (gameState.currentTime >= 0) {
        // Timer ticking
        io.to(room).emit(GameEvent.TIME_TICK, gameState.currentTime);
      } else {
        // TimeOut - reset timer and change turn
        changeTurn(gameState);
        io.to(room).emit(GameEvent.CHANGE_TURN, gameState.currentTeam);
      }
    }, 1000);
  }
  return timeSpan;
}

function onEndTurn(socketId: string, room: string): Team | null {
  const gameState: GameState = gamePackService.getGame(room);
  const player: Player = getPlayer(socketId, gameState);
  if (
    player.team !== gameState.currentTeam ||
    player.role === Role.JEM_MASTER
  ) {
    return null;
  }
  return changeTurn(gameState);
}

function clearTimer(state: GameState, erase: boolean = false): void {
  if (state.turnInterval) {
    clearInterval(state.turnInterval);
  }
  if (erase) {
    state.turnTime = 0;
    state.currentTime = 0;
  }
}

function onDisconnectGame(socketId: string, room: string): PlayerAction | null {
  const gameState: GameState = gamePackService.getGame(room);
  if (gameState) {
    // Find and remove player, decrease players count
    const index: number = gameState.players.findIndex(
      (player) => player.id === socketId,
    );
    if (index !== -1) {
      const player: Player = gameState.players[index];
      gameState.players.splice(index, 1);
      changePlayersCount(player, gameState, true);
      if (gameState.players.length === 0) {
        // Remove game upon 0 players
        clearTimer(gameState, true);
        gamePackService.deleteGamePack(room);
        log.info(REQUESTOR, `Room ${room} removed`);
        return null;
      }
      return {
        nick: player.nick,
        updatedPlayers: Array.from(gameState.players),
      };
    }
  }
  return null;
}

function changeTurn(room: GameState): Team {
  room.currentTeam = otherTeam(room.currentTeam);
  // Reset timer if exists
  if (room.turnTime) {
    room.currentTime = room.turnTime;
  }
  return room.currentTeam;
}

function getPlayer(playerId: string, game: GameState): Player {
  const player: Player | undefined = game.players.find(
    (p) => p.id === playerId,
  );
  if (!player) {
    throw new Error(NOT_FOUND);
  }
  return player;
}

function otherTeam(team: Team): Team {
  return team === Team.SAPPHIRE ? Team.RUBY : Team.SAPPHIRE;
}

function otherRole(role: Role): Role {
  return role === Role.JEMOLOGIST ? Role.JEM_MASTER : Role.JEMOLOGIST;
}

function changePlayersCount(
  player: Player,
  game: GameState,
  decrease: boolean = false,
  teamChange: boolean = false,
): void {
  if (player.team === Team.SAPPHIRE) {
    decrease ? game.sapphirePlayers-- : game.sapphirePlayers++;
    teamChange ? game.rubyPlayers-- : undefined;
  } else {
    decrease ? game.rubyPlayers-- : game.rubyPlayers++;
    teamChange ? game.sapphirePlayers-- : undefined;
  }
}

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
