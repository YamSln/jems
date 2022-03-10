import fs from "fs";
import { JoinPayload } from "../model/join.payload";
import jwtManager from "./jwt.manager";
import jwt from "jsonwebtoken";
import { Socket } from "socket.io";
import { mocked } from "ts-jest/utils";

describe("JWT Manager Unit Tests", () => {
  describe("Public Key", () => {
    it("should return public key", () => {
      const publicKey = fs.readFileSync("public.key", "utf8");

      const retreivedKey = jwtManager.getPublicKey();

      expect(publicKey).toEqual(retreivedKey);
    });
  });

  describe("Generate JWT", () => {
    it("should generate jwt with join payload information", () => {
      const payload: JoinPayload = {
        nick: "player",
        room: "roomId",
        password: "password",
      };
      const generatedJwt = jwtManager.generateJwt(payload);
      const decoded = jwt.decode(generatedJwt) as JoinPayload;

      expect(decoded.nick).toEqual(payload.nick);
    });
  });
});
