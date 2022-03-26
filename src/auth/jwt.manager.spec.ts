import { JoinPayload } from "../model/join.payload";
import jwtManager from "./jwt.manager";
import jwt from "jsonwebtoken";
import fs from "fs";
import env from "../config/env";
import { CreateGamePayload } from "../client/src/app/model/create-game.payload";
import { Socket } from "socket.io";

describe("JWT Manager Unit Tests", () => {
  describe("JWT Generation Unit Tests", () => {
    let publicKey;
    beforeAll(() => {
      publicKey = env.devEnv()
        ? fs.readFileSync("public.key", "utf8")
        : process.env.PUBLIC_KEY;
    });
    it("should generate JWT from join payload", () => {
      const joinPayload: JoinPayload = {
        nick: "nick",
        password: "password",
        room: "room",
      };

      const token = jwtManager.generateJwt(joinPayload);
      const verified = jwt.verify(token, publicKey) as JoinPayload;
      expect(verified.nick).toEqual(joinPayload.nick);
      expect(verified.password).toEqual(joinPayload.password);
      expect(verified.room).toEqual(joinPayload.room);
    });
    it("should generate JWT from create payload", () => {
      const joinPayload: CreateGamePayload = {
        nick: "nick",
        password: "password",
        maxPlayers: 4,
      };

      const token = jwtManager.generateJwt(joinPayload);
      const verified = jwt.verify(token, publicKey) as CreateGamePayload;
      expect(verified.nick).toEqual(joinPayload.nick);
      expect(verified.password).toEqual(joinPayload.password);
      expect(verified.maxPlayers).toEqual(joinPayload.maxPlayers);
    });
  });
});
