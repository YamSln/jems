import request from "supertest";
import { app } from "../app";
import jwt from "jsonwebtoken";
import {
  NICK_MAX_LENGTH,
  NICK_MIN_LENGTH,
  NICK_REQUIRED,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REQUIRED,
} from "../validation/game.validation";
import { INCORRECT_PASSWORD, NOT_FOUND } from "../error/error.util";
import { HttpStatusCode } from "../util/http-status-code";
import handler from "../service/game.handler";
import { CreateGamePayload } from "../model/create-game.payload";

describe("Game Routes Integration Tests", () => {
  describe("Create Game", () => {
    it("`POST /create` : should create game and return 201", async () => {
      const response = await request(app)
        .post("/create")
        .send({ nick: "player", password: "password", maxPlayers: 4 });

      expect(response.status).toEqual(201);
      expect(response.body).toBeDefined();
      const decoded = jwt.decode(response.body.token) as CreateGamePayload;
      expect(decoded.nick).toEqual("player");
      expect(decoded.password).toEqual("password");
    });

    it("`POST /create` : should return 400 when nick does not exist", async () => {
      const response = await request(app)
        .post("/create")
        .send({ password: "password", maxPlayers: 4 });

      expect(response.status).toEqual(400);
      expect(response.body.errors).toEqual(
        expect.arrayContaining([NICK_REQUIRED, NICK_MIN_LENGTH])
      );
    });

    it("`POST /create` : should return 400 when nick is less than 2 characters", async () => {
      const response = await request(app)
        .post("/create")
        .send({ nick: "n", password: "password", maxPlayers: 4 });

      expect(response.status).toEqual(400);
      expect(response.body.errors).toEqual(
        expect.arrayContaining([NICK_MIN_LENGTH])
      );
    });

    it("`POST /create` : should return 400 when nick is longer than 15 characters", async () => {
      const response = await request(app).post("/create").send({
        nick: "nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn",
        password: "password",
        maxPlayers: 4,
      });

      expect(response.status).toEqual(400);
      expect(response.body.errors).toEqual(
        expect.arrayContaining([NICK_MAX_LENGTH])
      );
    });

    it("`POST /create` : should return 400 when password does not exist", async () => {
      const response = await request(app).post("/create").send({
        nick: "player",
      });

      expect(response.status).toEqual(400);
      expect(response.body.errors).toEqual(
        expect.arrayContaining([PASSWORD_REQUIRED, PASSWORD_MIN_LENGTH])
      );
    });

    it("`POST /create` : should return 400 when password is less than 3 characters", async () => {
      const response = await request(app).post("/create").send({
        nick: "player",
        password: "12",
        maxPlayers: 4,
      });

      expect(response.status).toEqual(400);
      expect(response.body.errors).toEqual(
        expect.arrayContaining([PASSWORD_MIN_LENGTH])
      );
    });

    it("`POST /create` : should return 400 when password is more than 10 characters", async () => {
      const response = await request(app).post("/create").send({
        nick: "player",
        password: "nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn",
        maxPlayers: 4,
      });

      expect(response.status).toEqual(400);
      expect(response.body.errors).toEqual(
        expect.arrayContaining([PASSWORD_MAX_LENGTH])
      );
    });

    it("`POST /create` : should return 400 when max players is lower than 4", async () => {
      const response = await request(app).post("/create").send({
        nick: "player",
        password: "nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn",
        maxPlayers: 3,
      });

      expect(response.status).toEqual(400);
      expect(response.body.errors).toEqual(
        expect.arrayContaining([PASSWORD_MAX_LENGTH])
      );
    });

    it("`POST /create` : should return 400 when max players above 8", async () => {
      const response = await request(app).post("/create").send({
        nick: "player",
        password: "nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn",
        maxPlayers: 9,
      });

      expect(response.status).toEqual(400);
      expect(response.body.errors).toEqual(
        expect.arrayContaining([PASSWORD_MAX_LENGTH])
      );
    });
  });

  describe("Join Game", () => {
    it("`POST /join` : should join game and return 200", async () => {
      const createdRoom = await request(app)
        .post("/create")
        .send({ nick: "player", password: "password", maxPlayers: 5 });
      const decoded = jwt.decode(createdRoom.body.token) as CreateGamePayload;
      handler.onCreateGame("playerid", decoded);

      const response = await request(app)
        .post("/join")
        .send({ room: decoded.room, nick: "player", password: "password" });

      expect(response.status).toEqual(200);
      expect(decoded.nick).toEqual("player");
      expect(decoded.password).toEqual("password");
      expect(decoded.room).toEqual(decoded.room);
    });

    it("`POST /join` : should return 400 when password is incorrect", async () => {
      const createdRoom = await request(app)
        .post("/create")
        .send({ nick: "player", password: "password", maxPlayers: 5 });
      const decoded = jwt.decode(createdRoom.body.token) as CreateGamePayload;
      handler.onCreateGame("playerid", decoded);

      const response = await request(app)
        .post("/join")
        .send({ room: decoded.room, nick: "player", password: "other" });

      expect(response.status).toEqual(400);
      expect(response.body.message).toEqual(INCORRECT_PASSWORD);
    });

    it("`POST /join` : should return 400 when game does not exist", async () => {
      const response = await request(app).post("/join").send({
        room: "room",
        nick: "player",
        password: "other",
        maxPlayers: 5,
      });

      expect(response.status).toEqual(HttpStatusCode.NOT_FOUND);
      expect(response.body.message).toEqual(NOT_FOUND);
    });
  });
});
