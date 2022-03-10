import httpMocks from "node-mocks-http";
import { JoinPayload } from "../model/join.payload";
import handler from "../service/game.handler";
import middleware from "./game.middleware";

describe("Game Middleware Unit Tests", () => {
  describe("Create Game", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    it("should create game", () => {
      const request = httpMocks.createRequest({
        body: { nick: "player", password: "password", maxPlayers: 5 },
      });
      const response = httpMocks.createResponse();
      const next = jest.fn();

      let gameCreationSpy = jest
        .spyOn(handler, "createGame")
        .mockReturnValueOnce("token");

      middleware.createGame(request, response, next);

      expect(gameCreationSpy).toHaveBeenCalledWith("player", "password", 5);
      expect(response.statusCode).toEqual(201);
      expect(response._getJSONData()).toEqual({
        token: "token",
        maxPlayers: 5,
      });
    });
  });

  describe("Join Game", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    it("should join game", () => {
      const joinPayload: JoinPayload = {
        nick: "player",
        room: "roomId",
        password: "password",
      };
      const request = httpMocks.createRequest({
        body: joinPayload,
      });
      const response = httpMocks.createResponse();
      const next = jest.fn();

      let joinGameSpy = jest
        .spyOn(handler, "joinGame")
        .mockReturnValueOnce("token");

      middleware.joinGame(request, response, next);

      expect(joinGameSpy).toHaveBeenCalledWith(joinPayload);
      expect(response.statusCode).toEqual(200);
      expect(response._getJSONData()).toEqual("token");
    });
  });
});
