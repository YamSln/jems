import { check } from "express-validator";
import {
  MAX_PLAYERS_MAX,
  MAX_PLAYERS_MIN,
  MAX_PLAYERS_REQUIRED,
  MAX_WORD_PACKS,
  NICK_MAX_LENGTH,
  NICK_MIN_LENGTH,
  NICK_REQUIRED,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REQUIRED,
} from "./validation.messages";
import {
  MAXIMUM_MAX_PLAYERS,
  MAX_NICK_LENGTH,
  MAX_PASSWORD_LENGTH,
  MAX_WORDS_PER_PACK,
  MAX_WORD_LENGTH,
  MAX_WORD_PACKS_COUNT,
  MINIMUM_MAX_PLAYERS,
  MIN_NICK_LENGTH,
  MIN_PASSWORD_LENGTH,
  MIN_WORDS_PER_PACK,
  SUPPORTED_FILE_EXT,
} from "../util/game.constants";
import { WordPackFile } from "../model/word-pack.model";

const validateWordPacks = check("wordPacks")
  .optional()
  .isArray({ min: 1, max: MAX_WORD_PACKS_COUNT }) // Max word packs
  .withMessage(MAX_WORD_PACKS)
  .custom((wordPacks) => {
    if (wordPacks) {
      wordPacks.forEach((wordPack: WordPackFile) => {
        wordPackExtCheck(wordPack);
        wordPackNumberOfWordsCheck(wordPack);
        wordPackWordsLengthCheck(wordPack);
      });
    }
    return true;
  });

const wordPackExtCheck = (wordPack: WordPackFile): void => {
  if (!SUPPORTED_FILE_EXT.includes(wordPack.fileExtention)) {
    throw new Error(
      `Word pack ${wordPack.name} has a file extention ${
        wordPack.fileExtention
      } which is not supported, supported extentions are: ${SUPPORTED_FILE_EXT.toString()}`,
    );
  }
};

const wordPackNumberOfWordsCheck = (wordPack: WordPackFile): void => {
  // Minimum words per pack
  if (wordPack.words.length < MIN_WORDS_PER_PACK) {
    throw new Error(
      `Word pack ${wordPack.name} contains less words than the minimum allowed of ${MIN_WORDS_PER_PACK}`,
    );
  }
  // Maximum words per pack
  if (wordPack.words.length > MAX_WORDS_PER_PACK) {
    throw new Error(
      `Word pack ${wordPack.name} contains more words than the maximum allowed of ${MAX_WORDS_PER_PACK}`,
    );
  }
};

const wordPackWordsLengthCheck = (wordPack: WordPackFile): void => {
  wordPack.words.forEach((word) => {
    if (word.length > MAX_WORD_LENGTH) {
      throw new Error(
        `Word pack ${wordPack.name} contains the word ${word.substring(
          0,
          7,
        )}... that has the length of ${
          word.length
        } which exceeds the maximum length of ${MAX_WORD_LENGTH}`,
      );
    }
  });
};

const validateNick = check("nick")
  .exists()
  .withMessage(NICK_REQUIRED)
  .isLength({ min: MIN_NICK_LENGTH })
  .withMessage(NICK_MIN_LENGTH)
  .isLength({ max: MAX_NICK_LENGTH })
  .withMessage(NICK_MAX_LENGTH);

const validatePassword = check("password")
  .exists()
  .withMessage(PASSWORD_REQUIRED)
  .isLength({ min: MIN_PASSWORD_LENGTH })
  .withMessage(PASSWORD_MIN_LENGTH)
  .isLength({ max: MAX_PASSWORD_LENGTH })
  .withMessage(PASSWORD_MAX_LENGTH);

const validateMaxPlayers = check("maxPlayers")
  .exists()
  .withMessage(MAX_PLAYERS_REQUIRED)
  .isInt({ min: MINIMUM_MAX_PLAYERS })
  .withMessage(MAX_PLAYERS_MIN)
  .isInt({ max: MAXIMUM_MAX_PLAYERS })
  .withMessage(MAX_PLAYERS_MAX);

export const validateCreatePayload = [
  validateWordPacks,
  validateNick,
  validatePassword,
  validateMaxPlayers,
];

export const validateJoinPayload = [validateNick, validatePassword];
