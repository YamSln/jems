import { JoinPayload } from "../model/join.payload";
import jwtManager, { TOKEN_PREFIX } from "./jwt.manager";
import jwt from "jsonwebtoken";
import fs from "fs";
import env from "../config/env";
import { CreateGamePayload } from "../client/src/app/model/create-game.payload";
import { FORBIDDEN } from "../error/error.util";

describe("JWT Manager Unit Tests", () => {
  describe("JWT Generation Unit Tests", () => {
    let publicKey;

    beforeAll(() => {
      publicKey = env.DEV_ENV
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

  describe("JWT Verification Unit Tests", () => {
    it("should throw FORBIDDEN when auth header does not present", () => {
      const socket: any = {
        handshake: {
          auth: {
            token: "",
          },
        },
      };
      const next = jest.fn();

      jwtManager.verifyJwt(socket, next);

      expect(next).toHaveBeenCalledWith(new Error(FORBIDDEN));
    });

    it("should throw FORBIDDEN when auth header does not contain valid prefix", () => {
      const socket: any = {
        handshake: {
          auth: {
            token: "invalidprefix restoftheheader",
          },
        },
      };
      const next = jest.fn();

      jwtManager.verifyJwt(socket, next);

      expect(next).toHaveBeenCalledWith(new Error(FORBIDDEN));
    });

    it("should throw FORBIDDEN when auth header contains prefix but not the actual token", () => {
      const socket: any = {
        handshake: {
          auth: {
            token: `${TOKEN_PREFIX} `,
          },
        },
      };
      const next = jest.fn();

      jwtManager.verifyJwt(socket, next);

      expect(next).toHaveBeenCalledWith(new Error(FORBIDDEN));
    });

    it("should throw FORBIDDEN when auth token exists but invalid", () => {
      const socket: any = {
        handshake: {
          auth: {
            token: `${TOKEN_PREFIX} invalidtoken`,
          },
        },
      };
      const next = jest.fn();

      jwtManager.verifyJwt(socket, next);

      expect(next).toHaveBeenCalledWith(new Error(FORBIDDEN));
    });

    it("should set auth header with decoded game creation token data", () => {
      const createPayload: CreateGamePayload = {
        nick: "nick",
        password: "password",
        maxPlayers: 4,
      };
      const token = jwtManager.generateJwt(createPayload);
      const socket: any = {
        handshake: {
          auth: {
            token: `${TOKEN_PREFIX} ${token}`,
          },
        },
      };
      const next = jest.fn();

      jwtManager.verifyJwt(socket, next);

      expect(socket.handshake.auth.nick).toEqual(createPayload.nick);
      expect(socket.handshake.auth.password).toEqual(createPayload.password);
      expect(socket.handshake.auth.maxPlayers).toEqual(
        createPayload.maxPlayers,
      );
      expect(next).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalledWith(new Error(FORBIDDEN));
    });

    it("should set auth header with decoded game join token data", () => {
      const createPayload: JoinPayload = {
        nick: "nick",
        password: "password",
        room: "room",
      };
      const token = jwtManager.generateJwt(createPayload);
      const socket: any = {
        handshake: {
          auth: {
            token: `${TOKEN_PREFIX} ${token}`,
          },
        },
      };
      const next = jest.fn();

      jwtManager.verifyJwt(socket, next);

      expect(socket.handshake.auth.nick).toEqual(createPayload.nick);
      expect(socket.handshake.auth.password).toEqual(createPayload.password);
      expect(socket.handshake.auth.room).toEqual(createPayload.room);
      expect(next).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalledWith(new Error(FORBIDDEN));
    });
  });
});
