import express from "express";
import { catchErrors } from "../error";
import { gameMiddleware, wordPacksMiddleware } from "../middleware";
import {
  validateCreatePayload,
  validateJoinPayload,
} from "../validation/game.validation";
import validator from "../validation/validation";
import fileUpload from "express-fileupload";
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
  wordPacksMiddleware.parseWordPackFiles,
  validateCreatePayload,
  validator.makeValidation,
  catchErrors(gameMiddleware.createGame),
);
router.post(
  "/join",
  validateJoinPayload,
  validator.makeValidation,
  catchErrors(gameMiddleware.joinGame),
);

export = router;
