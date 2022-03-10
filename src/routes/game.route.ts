import express from "express";
import { catchErrors } from "../error/error.catcher";
import middleware from "../middleware/game.middleware";
import {
  validateCreatePayload,
  validateJoinPayload,
} from "../validation/game.validation";
import validator from "../validation/validation";

const router = express.Router();

router.post(
  "/create",
  validateCreatePayload,
  validator.makeValidation,
  catchErrors(middleware.createGame)
);
router.post(
  "/join",
  validateJoinPayload,
  validator.makeValidation,
  catchErrors(middleware.joinGame)
);

export = router;
