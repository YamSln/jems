import { NOT_FOUND } from "../error";
import { GameState } from "../model/game.model";

const games: Map<string, GameState> = new Map<string, GameState>();

function setGame(gameId: string, gameState: GameState): void {
  games.set(gameId, gameState);
}

function getGame(gameId: string): GameState {
  const gameState: GameState | undefined = games.get(gameId);
  if (!gameState) {
    throw new Error(NOT_FOUND);
  }
  return gameState;
}

function deleteGame(gameId: string): boolean {
  return games.delete(gameId);
}

export default {
  setGame,
  getGame,
  deleteGame,
};
