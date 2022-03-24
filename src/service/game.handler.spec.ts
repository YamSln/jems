import handler from "../service/game.handler";
import jwt from "jsonwebtoken";
import { JoinPayload } from "../model/join.payload";
import { validate as uuid } from "uuid";
import { GameState } from "../model/game.model";
import { Team } from "../model/team.model";
import service from "./game.service";
import { INCORRECT_PASSWORD, ROOM_FULL } from "../error/error.util";
import { Participant } from "../model/participant.model";
import { Role } from "../model/role.model";
import { CreateGamePayload } from "../model/create-game.payload";

describe("Game Handler Unit Tests", () => {
  describe("Create Game", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    it("should generate game creation token", () => {
      const nick: string = "player";
      const password: string = "password";
      const maxPlayers: number = 5;

      const gameToken: string = handler.createGame(nick, password, maxPlayers);
      const decoded: CreateGamePayload = jwt.decode(
        gameToken
      ) as CreateGamePayload;

      expect(decoded.nick).toEqual(nick);
      expect(decoded.password).toEqual(password);
      expect(uuid(decoded.room)).toBeTruthy();
    });

    it("should create new game state and insert creator as participant", () => {
      const gameState: GameState = {
        blueTeamPoints: 9,
        redTeamPoints: 8,
        currentTeam: Team.SAPPHIRE,
        participants: [],
        maxPlayers: 4,
        password: "password",
        currentTime: 0,
        turnTime: 0,
        words: [],
      };
      const joinPayload: CreateGamePayload = {
        nick: "player",
        room: "room1",
        password: "password",
        maxPlayers: 5,
      };

      let gameCreationSpy = jest
        .spyOn(service, "createGame")
        .mockReturnValueOnce(gameState);

      const createdGame = handler.onCreateGame("socketId", joinPayload);

      expect(gameCreationSpy).toHaveBeenCalledWith(
        gameState.password,
        joinPayload.maxPlayers
      );
      createdGame.participants.forEach((participant) => {
        expect(participant.id).toEqual("socketId");
      });
    });
  });

  describe("Join Game", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    it("should generate join token", () => {
      const gameState: GameState = {
        blueTeamPoints: 9,
        redTeamPoints: 8,
        currentTeam: Team.SAPPHIRE,
        participants: [],
        maxPlayers: 4,
        password: "password",
        currentTime: 0,
        turnTime: 0,
        words: [],
      };
      const joinPayload: CreateGamePayload = {
        nick: "player",
        room: "room2",
        password: "password",
        maxPlayers: 5,
      };
      const socketId = "socketId";

      jest.spyOn(service, "createGame").mockReturnValueOnce(gameState);

      handler.onCreateGame(socketId, joinPayload);

      const joinedToken = handler.joinGame(joinPayload);
      const decoded: JoinPayload = jwt.decode(joinedToken) as JoinPayload;

      expect(decoded.nick).toEqual(joinPayload.nick);
      expect(decoded.password).toEqual(joinPayload.password);
      expect(decoded.room).toEqual(joinPayload.room);
    });

    it("should throw error when password is incorrect", () => {
      const gameState: GameState = {
        blueTeamPoints: 9,
        redTeamPoints: 8,
        currentTeam: Team.SAPPHIRE,
        participants: [],
        maxPlayers: 4,
        password: "password",
        currentTime: 0,
        turnTime: 0,
        words: [],
      };
      const joinPayload: CreateGamePayload = {
        nick: "player",
        room: "room3",
        password: "other password",
        maxPlayers: 5,
      };
      const socketId = "socketId";

      jest.spyOn(service, "createGame").mockReturnValueOnce(gameState);

      handler.onCreateGame(socketId, joinPayload);

      expect(() => handler.joinGame(joinPayload)).toThrow(INCORRECT_PASSWORD);
    });

    it("should throw error when room is full", () => {
      const participants: Participant[] = [];
      for (let i = 0; i < 8; i++) {
        participants[i] = {
          id: "playerid",
          nick: "player",
          role: Role.OPERATIVE,
          team: Team.SAPPHIRE,
        };
      }
      const gameState: GameState = {
        blueTeamPoints: 9,
        redTeamPoints: 8,
        currentTeam: Team.SAPPHIRE,
        participants,
        maxPlayers: 4,
        password: "password",
        currentTime: 0,
        turnTime: 0,
        words: [],
      };
      const joinPayload: CreateGamePayload = {
        nick: "player",
        room: "room4",
        password: "password",
        maxPlayers: 5,
      };
      const socketId = "socketId";

      jest.spyOn(service, "createGame").mockReturnValueOnce(gameState);

      handler.onCreateGame(socketId, joinPayload);

      expect(() => handler.joinGame(joinPayload)).toThrow(ROOM_FULL);
    });

    it("should join game", () => {
      const gameState: GameState = {
        blueTeamPoints: 9,
        redTeamPoints: 8,
        currentTeam: Team.SAPPHIRE,
        participants: [],
        maxPlayers: 4,
        password: "password",
        currentTime: 0,
        turnTime: 0,
        words: [],
      };
      const createPayload: CreateGamePayload = {
        nick: "creator",
        room: "room5",
        password: "password",
        maxPlayers: 5,
      };
      const joinPayload: JoinPayload = {
        nick: "player",
        room: "room5",
        password: "password",
      };
      const socketId = "socketId";

      jest.spyOn(service, "createGame").mockReturnValueOnce(gameState);

      handler.onCreateGame(socketId, createPayload);

      const joinEvent = handler.onJoinGame(socketId, joinPayload);

      const exists = joinEvent.state.participants.some(
        (participant) => participant.id === joinEvent.joined.id
      );
      expect(exists).toBeTruthy();
    });
  });
});
