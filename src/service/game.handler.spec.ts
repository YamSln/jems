import handler from "../service/game.handler";
import { handlerTest } from "../service/game.handler";
import jwt from "jsonwebtoken";
import { JoinPayload } from "../model/join.payload";
import { validate as uuid } from "uuid";
import { GameState } from "../model/game.model";
import { Team } from "../model/team.model";
import service from "./game.service";
import {
  INCORRECT_PASSWORD,
  NICK_TAKEN,
  NOT_FOUND,
  ROOM_FULL,
} from "../error/error.util";
import { Role } from "../model/role.model";
import { CreateGamePayload } from "../model/create-game.payload";
import { WordType } from "../model/word.type";
import { Player } from "../model/player.model";

describe("Game Handler Unit Tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
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
        gameToken,
      ) as CreateGamePayload;

      expect(decoded.nick).toEqual(nick);
      expect(decoded.password).toEqual(password);
      expect(uuid(decoded.room)).toBeTruthy();
    });

    it("should create new game state and insert creator as player", () => {
      const gameState: GameState = {
        sapphirePoints: 9,
        rubyPoints: 8,
        currentTeam: Team.SAPPHIRE,
        players: [],
        maxPlayers: 4,
        password: "password",
        wordsPacks: [],
        sapphirePlayers: 0,
        rubyPlayers: 0,
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
        joinPayload.maxPlayers,
      );
      expect(
        createdGame.sapphirePlayers > 0 || createdGame.rubyPlayers > 0,
      ).toBeTruthy();
      createdGame.players.forEach((player) => {
        expect(player.id).toEqual("socketId");
      });
      expect(handlerTest.rooms.get(joinPayload.room)).toEqual(createdGame);
    });
  });

  describe("Join Game", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    it("should generate join token", () => {
      const gameState: GameState = {
        sapphirePoints: 9,
        rubyPoints: 8,
        currentTeam: Team.SAPPHIRE,
        players: [],
        maxPlayers: 4,
        password: "password",
        wordsPacks: [],
        sapphirePlayers: 0,
        rubyPlayers: 0,
        currentTime: 0,
        turnTime: 0,
        words: [],
      };
      const createPayload: CreateGamePayload = {
        nick: "player",
        room: "room2",
        password: "password",
        maxPlayers: 5,
      };
      const joinPayload: JoinPayload = {
        nick: "player1",
        room: "room2",
        password: "password",
      };
      const socketId = "socketId";

      jest.spyOn(service, "createGame").mockReturnValueOnce(gameState);

      handler.onCreateGame(socketId, createPayload);

      const joinedToken = handler.joinGame(joinPayload);
      const decoded: JoinPayload = jwt.decode(joinedToken) as JoinPayload;

      expect(decoded.nick).toEqual(joinPayload.nick);
      expect(decoded.password).toEqual(joinPayload.password);
      expect(decoded.room).toEqual(joinPayload.room);
    });

    it("should throw error when password is incorrect", () => {
      const gameState: GameState = {
        sapphirePoints: 9,
        rubyPoints: 8,
        currentTeam: Team.SAPPHIRE,
        players: [],
        maxPlayers: 4,
        password: "password",
        wordsPacks: [],
        sapphirePlayers: 0,
        rubyPlayers: 0,
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
      const players: Player[] = [];
      for (let i = 0; i < 8; i++) {
        players[i] = {
          id: "playerid",
          nick: "player",
          role: Role.JEMOLOGIST,
          team: Team.SAPPHIRE,
        };
      }
      const gameState: GameState = {
        sapphirePoints: 9,
        rubyPoints: 8,
        currentTeam: Team.SAPPHIRE,
        players,
        maxPlayers: 4,
        password: "password",
        wordsPacks: [],
        sapphirePlayers: 0,
        rubyPlayers: 0,
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

    it("should throw error when nick is taken", () => {
      const gameState: GameState = {
        sapphirePoints: 9,
        rubyPoints: 8,
        currentTeam: Team.SAPPHIRE,
        players: [],
        maxPlayers: 4,
        password: "password",
        wordsPacks: [],
        sapphirePlayers: 0,
        rubyPlayers: 0,
        currentTime: 0,
        turnTime: 0,
        words: [],
      };
      const createPayload: CreateGamePayload = {
        nick: "player",
        room: "room2",
        password: "password",
        maxPlayers: 5,
      };
      const joinPayload: JoinPayload = {
        nick: "player",
        room: "room2",
        password: "password",
      };
      const socketId = "socketId";

      jest.spyOn(service, "createGame").mockReturnValueOnce(gameState);

      handler.onCreateGame(socketId, createPayload);

      expect(() => handler.joinGame(joinPayload)).toThrow(NICK_TAKEN);
    });

    it("should throw NOT_FOUND when game does not exist", () => {
      const joinPayload: JoinPayload = {
        nick: "player",
        room: "room5",
        password: "password",
      };
      const socketId = "socketId";

      expect(() => handler.onJoinGame(socketId, joinPayload)).toThrow(
        NOT_FOUND,
      );
    });

    it("should throw NOT_FOUND when password is incorrect", () => {
      const createPayload: CreateGamePayload = {
        nick: "player",
        room: "room2",
        password: "password",
        maxPlayers: 5,
      };
      const joinPayload: JoinPayload = {
        nick: "player",
        room: "room5",
        password: "password1",
      };
      const socketId = "socketId";
      handler.onCreateGame(socketId, createPayload);

      expect(() => handler.onJoinGame(socketId, joinPayload)).toThrow(
        NOT_FOUND,
      );
    });

    it("should join game", () => {
      const gameState: GameState = {
        sapphirePoints: 9,
        rubyPoints: 8,
        currentTeam: Team.SAPPHIRE,
        players: [],
        maxPlayers: 4,
        password: "password",
        wordsPacks: [],
        sapphirePlayers: 0,
        rubyPlayers: 0,
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

      const player = joinEvent.state.players.find(
        (player) => player.id === joinEvent.joined.id,
      );
      expect(
        joinEvent.state.rubyPlayers && joinEvent.state.sapphirePlayers,
      ).toBeTruthy();
      expect(player).toBeTruthy();
    });
  });

  describe("New Game", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    it("should return new game and clear timer", () => {
      const gameState: GameState = {
        sapphirePoints: 9,
        rubyPoints: 8,
        currentTeam: Team.SAPPHIRE,
        players: [],
        maxPlayers: 4,
        password: "password",
        wordsPacks: [],
        turnInterval: setInterval(() => {}, 1000),
        sapphirePlayers: 0,
        rubyPlayers: 0,
        currentTime: 0,
        turnTime: 0,
        words: [],
      };
      const createPayload: CreateGamePayload = {
        nick: "player",
        room: "room2",
        password: "password",
        maxPlayers: 5,
      };
      const socketId = "socketId";

      jest.spyOn(service, "createGame").mockReturnValueOnce(gameState);

      handler.onCreateGame(socketId, createPayload);

      const newGame = handler.onNewGame("room2");

      expect(newGame.currentTime).toEqual(0);
      expect(handlerTest.rooms.get(createPayload.room)).toEqual(newGame);
    });
  });

  describe("Word Click", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should return null when word does not exist", () => {
      const gameState: GameState = {
        sapphirePoints: 9,
        rubyPoints: 8,
        currentTeam: Team.SAPPHIRE,
        players: [],
        maxPlayers: 4,
        password: "password",
        wordsPacks: [],
        sapphirePlayers: 0,
        rubyPlayers: 0,
        currentTime: 0,
        turnTime: 0,
        words: [],
      };
      const createPayload: CreateGamePayload = {
        nick: "player",
        room: "room2",
        password: "password",
        maxPlayers: 5,
      };
      const socketId = "socketId";
      jest.spyOn(service, "createGame").mockReturnValueOnce(gameState);

      handler.onCreateGame(socketId, createPayload);

      const word = handler.onWordClick(-1, socketId, createPayload.room);

      expect(word).toBeNull();
    });

    it("should return null when word already selected", () => {
      const wordIndex = 0;
      const gameState: GameState = {
        sapphirePoints: 9,
        rubyPoints: 8,
        currentTeam: Team.SAPPHIRE,
        players: [],
        maxPlayers: 4,
        password: "password",
        wordsPacks: [],
        sapphirePlayers: 0,
        rubyPlayers: 0,
        currentTime: 0,
        turnTime: 0,
        words: [
          {
            content: "content",
            index: wordIndex,
            selected: true,
            type: WordType.SAPPHIRE,
          },
        ],
      };
      const createPayload: CreateGamePayload = {
        nick: "player",
        room: "room2",
        password: "password",
        maxPlayers: 5,
      };
      const socketId = "socketId";
      jest.spyOn(service, "createGame").mockReturnValueOnce(gameState);

      handler.onCreateGame(socketId, createPayload);

      const word = handler.onWordClick(wordIndex, socketId, createPayload.room);

      expect(word).toBeNull();
    });

    it("should return null when players team not playing right now", () => {
      const wordIndex = 0;
      const currentTeam = Team.SAPPHIRE;
      const gameState: GameState = {
        sapphirePoints: 9,
        rubyPoints: 8,
        currentTeam: currentTeam,
        players: [],
        maxPlayers: 4,
        password: "password",
        wordsPacks: [],
        sapphirePlayers: 0,
        rubyPlayers: 0,
        currentTime: 0,
        turnTime: 0,
        words: [
          {
            content: "content",
            index: wordIndex,
            selected: false,
            type: WordType.SAPPHIRE,
          },
        ],
      };
      const createPayload: CreateGamePayload = {
        nick: "player",
        room: "room2",
        password: "password",
        maxPlayers: 5,
      };
      const socketId = "socketId";
      jest.spyOn(service, "createGame").mockReturnValueOnce(gameState);

      const game = handler.onCreateGame(socketId, createPayload);

      game.players[0].team = Team.RUBY;

      const word = handler.onWordClick(wordIndex, socketId, createPayload.room);

      expect(word).toBeNull();
    });
  });
});
