import { NextFunction, Request, Response } from "express";
import { JoinPayload } from "../model/join.payload";
import handler from "../service/game.handler";
import { HttpStatusCode } from "../util/http-status-code";

const createGame = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<any> => {
  const { nick, password, maxPlayers } = request.body;
  const token = handler.createGame(nick, password, maxPlayers);
  return response
    .status(HttpStatusCode.CREATED)
    .json({ token, maxPlayers: maxPlayers || 4 });
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
