import { check } from "express-validator";
import * as MESSAGES from "./validation.messages";
import * as CONSTANTS from "../util/game.constants";
import { WordPack } from "../model/word-pack.model";

const validateWordPacks = check("wordPacks")
  .optional()
  .isArray({ min: 1, max: CONSTANTS.MAX_WORD_PACKS_COUNT }) // Max word packs
  .withMessage(MESSAGES.MAX_WORD_PACKS)
  .custom((wordPacks) => {
    if (wordPacks) {
      wordPacks.forEach((wordPack: WordPack) => {
        wordPackExtCheck(wordPack);
        wordPackNumberOfWordsCheck(wordPack);
        wordPackWordsLengthCheck(wordPack);
      });
    }
    return true;
  });

function wordPackExtCheck(wordPack: WordPack): void {
  if (!CONSTANTS.SUPPORTED_FILE_EXT.includes(wordPack.fileExtention)) {
    throw new Error(
      `Word pack '${takeHead(wordPack.name)}' has a file extention ${
        wordPack.fileExtention
      } which is not supported, supported extentions are: ${CONSTANTS.SUPPORTED_FILE_EXT.toString()}`,
    );
  }
}

function wordPackNumberOfWordsCheck(wordPack: WordPack): void {
  // Minimum words per pack
  if (wordPack.words.length < CONSTANTS.MIN_WORDS_PER_PACK) {
    throw new Error(
      `Word pack '${takeHead(
        wordPack.name,
      )}' contains less words than the minimum allowed of ${
        CONSTANTS.MIN_WORDS_PER_PACK
      }`,
    );
  }
  // Maximum words per pack
  if (wordPack.words.length > CONSTANTS.MAX_WORDS_PER_PACK) {
    throw new Error(
      `Word pack '${takeHead(
        wordPack.name,
      )}' contains more words than the maximum allowed of ${
        CONSTANTS.MAX_WORDS_PER_PACK
      }`,
    );
  }
}

function wordPackWordsLengthCheck(wordPack: WordPack): void {
  wordPack.words.forEach((word) => {
    // Max word length
    if (word.length > CONSTANTS.MAX_WORD_LENGTH) {
      throw new Error(
        `Word pack '${takeHead(wordPack.name)}' contains the word '${takeHead(
          word,
        )}...' that has the length of ${
          word.length
        } which exceeds the maximum length of ${CONSTANTS.MAX_WORD_LENGTH}`,
      );
    }
    // Min word length
    if (word.length > CONSTANTS.MAX_WORD_LENGTH) {
      throw new Error(
        `Word pack '${takeHead(
          wordPack.name,
        )}' contains the word '${word}...' that has the length of ${
          word.length
        } which is below the minimum length of ${CONSTANTS.MAX_WORD_LENGTH}`,
      );
    }
  });
}

function takeHead(name: string): string {
  return name.substring(0, 7);
}

const validateNick = check("nick")
  .exists()
  .withMessage(MESSAGES.NICK_REQUIRED)
  .isLength({ min: CONSTANTS.MIN_NICK_LENGTH })
  .withMessage(MESSAGES.NICK_MIN_LENGTH)
  .isLength({ max: CONSTANTS.MAX_NICK_LENGTH })
  .withMessage(MESSAGES.NICK_MAX_LENGTH);

const validatePassword = check("password")
  .exists()
  .withMessage(MESSAGES.PASSWORD_REQUIRED)
  .isLength({ min: CONSTANTS.MIN_PASSWORD_LENGTH })
  .withMessage(MESSAGES.PASSWORD_MIN_LENGTH)
  .isLength({ max: CONSTANTS.MAX_PASSWORD_LENGTH })
  .withMessage(MESSAGES.PASSWORD_MAX_LENGTH);

const validateMaxPlayers = check("maxPlayers")
  .exists()
  .withMessage(MESSAGES.MAX_PLAYERS_REQUIRED)
  .isInt({ min: CONSTANTS.MINIMUM_MAX_PLAYERS })
  .withMessage(MESSAGES.MAX_PLAYERS_MIN)
  .isInt({ max: CONSTANTS.MAXIMUM_MAX_PLAYERS })
  .withMessage(MESSAGES.MAX_PLAYERS_MAX);

export const validateCreatePayload = [
  validateWordPacks,
  validateNick,
  validatePassword,
  validateMaxPlayers,
];

export const validateJoinPayload = [validateNick, validatePassword];
