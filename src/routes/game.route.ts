import express from "express";
import { catchErrors } from "../error/error.catcher";
import middleware from "../middleware/game.middleware";
import {
  validateCreatePayload,
  validateJoinPayload,
} from "../validation/game.validation";
import validator from "../validation/validation";
import fileUpload from "express-fileupload";
import wordPacksMiddleware from "../middleware/word-packs.middleware";
import { MAX_WORD_PACK_SIZE } from "../util/game.constants";

const router = express.Router();

router.post(
  "/create",
  fileUpload({
    createParentPath: true,
    abortOnLimit: true,
    limits: {
      fileSize: MAX_WORD_PACK_SIZE,
    },
  }),
  wordPacksMiddleware,
  validateCreatePayload,
  validator.makeValidation,
  catchErrors(middleware.createGame),
);
router.post(
  "/join",
  validateJoinPayload,
  validator.makeValidation,
  catchErrors(middleware.joinGame),
);

export = router;
