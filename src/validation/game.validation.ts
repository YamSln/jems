import { check } from "express-validator";

export const NICK_REQUIRED = "Nick name is required";
export const NICK_MIN_LENGTH = "Nick name must contain at least 2 characters";
export const NICK_MAX_LENGTH =
  "Nick name cannot contain more that 15 characters";
export const PASSWORD_REQUIRED = "Password is required";
export const PASSWORD_MIN_LENGTH =
  "Password must contain at least 3 characters";
export const PASSWORD_MAX_LENGTH =
  "Password cannot contain more that 10 characters";
export const MAX_PLAYERS_REQUIRED = "Maximum number of players is required";
export const MAX_PLAYERS_MIN = "Minimum number of players is 4";
export const MAX_PLAYERS_MAX = "Maximum number of players is 8";

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
