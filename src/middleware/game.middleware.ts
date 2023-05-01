import { NextFunction, Request, Response } from "express";
import { JoinPayload } from "../payload/join.payload";
import handler from "../service/game.service";
import { HttpStatusCode } from "../util/http-status-code";
import { MINIMUM_MAX_PLAYERS } from "../util/game.constants";

const createGame = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<any> => {
  const { nick, password, maxPlayers, wordPacks } = request.body;
  const token = handler.createGame(nick, password, maxPlayers, wordPacks);
  return response
    .status(HttpStatusCode.CREATED)
    .json({ token, maxPlayers: maxPlayers || MINIMUM_MAX_PLAYERS });
};

const joinGame = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<any> => {
  const joinPayload: JoinPayload = request.body;
  const token = handler.joinGame(joinPayload);
  return response.status(HttpStatusCode.OK).json(token);
};

export default {
  createGame,
  joinGame,
};
