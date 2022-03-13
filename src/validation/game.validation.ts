import { check } from "express-validator";
import {
  MAX_PLAYERS_MAX,
  MAX_PLAYERS_MIN,
  MAX_PLAYERS_REQUIRED,
  NICK_MAX_LENGTH,
  NICK_MIN_LENGTH,
  NICK_REQUIRED,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REQUIRED,
} from "./validation.messages";

const validateNick = check("nick")
  .exists()
  .withMessage(NICK_REQUIRED)
  .isLength({ min: 2 })
  .withMessage(NICK_MIN_LENGTH)
  .isLength({ max: 15 })
  .withMessage(NICK_MAX_LENGTH);

const validatePassword = check("password")
  .exists()
  .withMessage(PASSWORD_REQUIRED)
  .isLength({ min: 3 })
  .withMessage(PASSWORD_MIN_LENGTH)
  .isLength({ max: 10 })
  .withMessage(PASSWORD_MAX_LENGTH);

const validateMaxPlayers = check("maxPlayers")
  .exists()
  .withMessage(MAX_PLAYERS_REQUIRED)
  .isInt({ min: 4 })
  .withMessage(MAX_PLAYERS_MIN)
  .isInt({ max: 8 })
  .withMessage(MAX_PLAYERS_MAX);

export const validateCreatePayload = [
  validateNick,
  validatePassword,
  validateMaxPlayers,
];

export const validateJoinPayload = [validateNick, validatePassword];
