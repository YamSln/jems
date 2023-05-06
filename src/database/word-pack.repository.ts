import { NOT_FOUND } from "../error";
import { WordPackCollection, WordPack } from "../model/word-pack.model";
import { log } from "../log";

import wordsSource from "./words.json";

const REQUESTOR: string = "WP_REPOSITORY";
const wordPackCollections: Map<string, WordPackCollection> = new Map<
  string,
  WordPackCollection
>();

function setWordPackCollection(
  gameId: string,
  timeStamp: number,
  wordPacks: WordPack[],
): void {
  wordPackCollections.set(gameId, { timeStamp, wordPacks });
}

function getWordPackCollection(gameId: string): WordPackCollection {
  const wordPackCollection: WordPackCollection | undefined =
    wordPackCollections.get(gameId);
  if (!wordPackCollection) {
    throw new Error(NOT_FOUND);
  }
  return wordPackCollection;
}

function deleteWordPackCollection(gameId: string): boolean {
  return wordPackCollections.delete(gameId);
}

function deleteExpiredWordPacks(expirityOffset: number): void {
  for (const wordPackCollection of wordPackCollections) {
    if (
      wordPackCollection[1].timeStamp !== 0 &&
      wordPackCollection[1].timeStamp < Date.now() + expirityOffset
    ) {
      const deleted: boolean = deleteWordPackCollection(wordPackCollection[0]);
      if (deleted) {
        log.info(
          REQUESTOR,
          `Word pack signed under ${wordPackCollection[0]} was removed due to time expirity`,
        );
      }
    }
  }
}

function defaultWordsSource(): string[] {
  return wordsSource.data;
}

export default {
  setWordPackCollection,
  getWordPackCollection,
  deleteWordPackCollection,
  deleteExpiredWordPacks,
  defaultWordsSource,
};
