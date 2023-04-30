import { SimpleIntervalJob, Task, ToadScheduler } from "toad-scheduler";
import log from "../config/log";
import { GamePack, GameState } from "../model/game.model";
import { WordPackCollection } from "../model/word-pack.model";
import wordBase from "./words.json";
import { DEFAULT_WORDS_PACK_NAME } from "../util/game.constants";

const rooms: Map<string, GameState> = new Map<string, GameState>();
const wordPackCollections: Map<string, WordPackCollection> = new Map<
  string,
  WordPackCollection
>();
const clearingScheduler: ToadScheduler = new ToadScheduler();

const REQUESTOR: string = "GAME_REPOSITORY";

const setGame = (gameId: string, gameState: GameState): GamePack => {
  if (gameState.wordPacks.length == 0) {
    gameState.wordPacks.push(DEFAULT_WORDS_PACK_NAME);
  }
  const wordPackCollection = wordPackCollections.get(gameId);
  if (wordPackCollection && wordPackCollection.timeStamp != 0) {
    wordPackCollection.timeStamp = 0;
    wordPackCollection.wordPackFiles.forEach((wordPack) => {
      gameState.wordPacks.push(wordPack.name);
    });
  }
  rooms.set(gameId, gameState);
  return {
    state: gameState,
    wordsSource: wordPackCollections[gameState.selectedWordPack],
  };
};

const getGame = (gameId: string): GameState | undefined => {
  return rooms.get(gameId);
};

const getGamePack = (gameId: string): GamePack | undefined => {
  const state = getGame(gameId);
  const wordsPackCollection = getWordPackCollection(gameId);
  if (!state) {
    return undefined;
  }
  let wordsSource: string[] = [];
  if (!state.selectedWordPack || !wordsPackCollection) {
    wordsSource = wordBase.data;
  } else {
    wordsSource =
      wordsPackCollection.wordPackFiles[state.selectedWordPack - 1].words;
  }
  return { state, wordsSource };
};

const updateGamePack = (
  gameId: string,
  wordPackIndex: number,
): GamePack | undefined => {
  const state = getGame(gameId);
  if (state) {
    state.selectedWordPack = wordPackIndex;
    setGame(gameId, state);
  }
  return getGamePack(gameId);
};

const removeGame = (gameId: string): void => {
  rooms.delete(gameId);
  removeWordPackCollection(gameId);
};

const setWordPackCollection = (
  gameId: string,
  wordPackCollection: WordPackCollection,
): void => {
  wordPackCollections.set(gameId, wordPackCollection);
};

const getWordPackCollection = (
  gameId: string,
): WordPackCollection | undefined => {
  return wordPackCollections.get(gameId);
};

const defaultWordsSource = (): string[] => {
  return wordBase.data;
};

const removeWordPackCollection = (gameId: string): void => {
  wordPackCollections.delete(gameId);
};

const initClearingScheduler = (): void => {
  const wordPacksTask = new Task("Remove expiered unclaimed word packs", () => {
    for (let wordPackCollection of wordPackCollections) {
      const timeStamp: number = wordPackCollection[1].timeStamp;
      if (timeStamp != 0 && timeStamp + 5 < Date.now()) {
        log.info(
          REQUESTOR,
          `Word packs signed under ${wordPackCollection[0]} has been removed due to time expiry`,
        );
        removeWordPackCollection(wordPackCollection[0]);
      }
    }
  });
  const wordPacksJob = new SimpleIntervalJob({ seconds: 2 }, wordPacksTask);
  clearingScheduler.addSimpleIntervalJob(wordPacksJob);
};

export default {
  setGame,
  getGame,
  removeGame,
  getGamePack,
  updateGamePack,
  setWordPackCollection,
  getWordPackCollection,
  defaultWordsSource,
};
