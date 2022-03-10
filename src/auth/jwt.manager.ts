import fs from "fs";
import { SignOptions } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import { Socket } from "socket.io";
import { FORBIDDEN } from "../error/error.util";
import { JoinPayload } from "../model/join.payload";
import { ExtendedError } from "socket.io/dist/namespace";
import { CreateGamePayload } from "../client/src/app/model/create-game.payload";

export const TOKEN_PREFIX = "Bearer";

const privateKey = fs.readFileSync("private.key", "utf8");
const publicKey = fs.readFileSync("public.key", "utf8");

const getPublicKey = (): string => publicKey;

const generateJwt = (payload: JoinPayload | CreateGamePayload): string => {
  const options: SignOptions = {
    algorithm: "RS256",
    expiresIn: "5m",
  }; // Signs new jwt with join payload
  return jwt.sign(payload, privateKey, options);
};

const verifyJwt = (
  socket: Socket,
  next: (err?: ExtendedError | undefined) => any
) => {
  let authHeader = socket.handshake.auth.token; // Get token from auth header
  // Verify auth header and token prefix
  if (!authHeader || authHeader.indexOf(TOKEN_PREFIX) === -1) {
    return next(new Error(FORBIDDEN));
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    // Verify it exists
    return next(new Error(FORBIDDEN));
  } // Get public key for verification
  try {
    const decoded: JoinPayload = jwt.verify(token, publicKey) as JoinPayload; // Verify token
    socket.handshake.auth = decoded;
  } catch (err) {
    return next(new Error(FORBIDDEN));
  }
  return next();
};

export default {
  getPublicKey,
  generateJwt,
  verifyJwt,
};
