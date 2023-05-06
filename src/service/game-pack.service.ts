import { SimpleIntervalJob, Task, ToadScheduler } from "toad-scheduler";
import { gameRepository, wordPackRepository } from "../database";
import { GamePack, GameState } from "../model/game.model";
import { WordPack, WordPackCollection } from "../model/word-pack.model";
import {
  DEFAULT_WORDS_PACK_NAME,
  FIVE_MINUTES_MILLIS,
  WORD_PACK_EXPIRITY_OFFSET,
} from "../util/game.constants";

initClearingScheduler();

function setGamePack(gameId: string, gameState: GameState): void {
  if (gameState.wordPacks.length == 0) {
    gameState.wordPacks.push(DEFAULT_WORDS_PACK_NAME);
  }
  try {
    const wordPackCollection: WordPackCollection =
      wordPackRepository.getWordPackCollection(gameId);
    // Mark word packs as claimed
    if (wordPackCollection.timeStamp != 0) {
      wordPackCollection.timeStamp = 0;
      wordPackCollection.wordPacks.forEach((wordPack) => {
        gameState.wordPacks.push(wordPack.name);
      });
    }
  } catch {}
  setGame(gameId, gameState);
}

function setGame(gameId: string, gameState: GameState): void {
  gameRepository.setGame(gameId, gameState);
}

function setWordPackCollection(
  gameId: string,
  timeStamp: number,
  wordPacks: WordPack[],
): void {
  wordPackRepository.setWordPackCollection(gameId, timeStamp, wordPacks);
}

function getGame(gameId: string): GameState {
  return gameRepository.getGame(gameId);
}

function getGamePack(gameId: string): GamePack {
  const gameState: GameState = getGame(gameId);
  let wordsSource: string[];
  try {
    const wordPackCollection: WordPackCollection =
      wordPackRepository.getWordPackCollection(gameId);
    wordsSource =
      wordPackCollection.wordPacks[gameState.selectedWordPack - 1].words;
  } catch {
    // No uploaded word packs
    wordsSource = wordPackRepository.defaultWordsSource();
  }
  return {
    gameState,
    wordsSource,
  };
}

function updateGamePack(gameId: string, wordPackIndex: number): GamePack {
  const gameState: GameState = getGame(gameId);
  gameState.selectedWordPack = wordPackIndex;
  setGame(gameId, gameState);
  return getGamePack(gameId);
}

function deleteGamePack(gameId: string): boolean {
  wordPackRepository.deleteWordPackCollection(gameId);
  return gameRepository.deleteGame(gameId);
}

function defaultWordsSource(): string[] {
  return wordPackRepository.defaultWordsSource();
}

function initClearingScheduler(): void {
  const clearingScheduler: ToadScheduler = new ToadScheduler();
  clearingScheduler.stop();
  const wordPacksTask = new Task("Remove expiered unclaimed word packs", () =>
    wordPackRepository.deleteExpiredWordPacks(WORD_PACK_EXPIRITY_OFFSET),
  );
  const wordPacksJob = new SimpleIntervalJob(
    { milliseconds: FIVE_MINUTES_MILLIS },
    wordPacksTask,
  );
  clearingScheduler.addSimpleIntervalJob(wordPacksJob);
  // Stop clearing task on app exit
  process.addListener("exit", () => clearingScheduler.stop());
}

export default {
  setGame,
  setGamePack,
  setWordPackCollection,
  getGame,
  getGamePack,
  updateGamePack,
  deleteGamePack,
  defaultWordsSource,
};
