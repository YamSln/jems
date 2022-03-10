import { NextFunction, Request, Response } from "express";
import { JoinPayload } from "../model/join.payload";
import handler from "../service/game.handler";

const createGame = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<any> => {
  // Get create payload
  const { nick, password, maxPlayers } = request.body;
  // Generate token
  const token = handler.createGame(nick, password, maxPlayers);
  // Return response
  return response.status(201).json({ token, maxPlayers: maxPlayers || 4 });
};

const joinGame = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<any> => {
  // Get join payload
  const joinPayload: JoinPayload = request.body;
  // Generate token
  const token = handler.joinGame(joinPayload);
  // Return response
  return response.status(200).json(token);
};

export default {
  createGame,
  joinGame,
};
