import { GameState } from "../model/game.model";
import { Participant } from "../model/participant.model";
import { Role } from "../model/role.model";
import { Team } from "../model/team.model";
import { WordType } from "../model/word.type";
import service from "./game.service";

describe("Game Service Unit Tests", () => {
  describe("Random Number", () => {
    it("should return random number below max value", () => {
      const maxValue = 50;
      const randomNumber = service.getRandomNumber(maxValue);

      expect(randomNumber).toBeLessThanOrEqual(maxValue);
    });
  });

  describe("Random Team", () => {
    it("should return random team", () => {
      const randomTeam = service.getRandomTeam();

      expect(randomTeam).toBeDefined();
      expect(randomTeam in Team).toBeTruthy();
    });
  });

  describe("Generate Random Words", () => {
    it("should generate random 25 words", () => {
      const generateWords = service.getRandomWords();

      expect(generateWords.length).toEqual(25);
    });
  });

  describe("Create Words", () => {
    it("should create random 25 words", () => {
      const wordsCount = 25;
      const startingTeam = Team.SAPPHIRE;
      const words = service.generateWords(startingTeam, wordsCount);

      expect(words.length).toEqual(wordsCount);

      let blueWords: number = 0;
      let redWords: number = 0;
      let bombs: number = 0;
      let neutralWords: number = 0;
      words.forEach((word) => {
        switch (word.type) {
          case WordType.BLUE:
            blueWords++;
            break;
          case WordType.RED:
            redWords++;
            break;
          case WordType.BOMB:
            bombs++;
            break;
          case WordType.NEUTRAL:
            neutralWords++;
            break;
        }
      });

      expect(blueWords).toEqual(9);
      expect(redWords).toEqual(8);
      expect(bombs).toEqual(1);
      expect(neutralWords).toEqual(wordsCount - blueWords - redWords - bombs);
      const index = 24;
      expect(words[index].index).toEqual(index);
    });
  });

  describe("Shuffle Words", () => {
    it("should shuffle words and maintain indexes", () => {
      const words = service.generateWords(Team.SAPPHIRE);

      const shuffled = service.shuffleWords(words);

      expect(shuffled.length).toEqual(words.length);
      const index = 24;
      expect(shuffled[index].index).toEqual(index);
    });
  });

  describe("Create Game", () => {
    it("should create game", () => {
      const password = "password";
      const game = service.createGame(password, 4);

      const points = [game.blueTeamPoints, game.redTeamPoints];

      expect(game).toBeDefined();
      expect(points).toEqual(expect.arrayContaining([8, 9]));
      expect(game.currentTeam).toBeDefined();
      expect(game.participants).toEqual([]);
      expect(game.password).toEqual(password);
      expect(game.turnTime).toEqual(0);
      expect(game.words.length).toEqual(25);
    });
  });

  describe("New Game", () => {
    it("should create new game", () => {
      const words = service.generateWords(Team.SAPPHIRE);
      const participants: Participant[] = [
        {
          id: "id",
          nick: "part1",
          role: Role.SPY_MASTER,
          team: Team.SAPPHIRE,
        },
        {
          id: "id",
          nick: "part2",
          role: Role.SPY_MASTER,
          team: Team.RUBY,
        },
        {
          id: "id",
          nick: "part3",
          role: Role.OPERATIVE,
          team: Team.SAPPHIRE,
        },
        {
          id: "id",
          nick: "part4",
          role: Role.OPERATIVE,
          team: Team.RUBY,
        },
      ];
      const game: GameState = {
        blueTeamPoints: 0,
        redTeamPoints: 0,
        currentTeam: Team.SAPPHIRE,
        participants,
        password: "password",
        turnTime: 0,
        maxPlayers: 4,
        currentTime: 0,
        words,
      };

      const newGame = service.newGame(game);

      const teamPoints: number[] = [
        newGame.blueTeamPoints,
        newGame.redTeamPoints,
      ];

      const equalTeams = [Team.SAPPHIRE, Team.SAPPHIRE, Team.RUBY, Team.RUBY];

      expect(teamPoints).toEqual(expect.arrayContaining(teamPoints));
      expect(newGame.password).toEqual(game.password);
      expect(newGame.currentTeam in Team).toBeTruthy();
      expect(newGame.words.length).toEqual(25);
      expect(newGame.participants.length).toEqual(game.participants.length);
      newGame.participants.forEach((participants) => {
        expect(participants.role).toEqual(Role.OPERATIVE);
      });
      const teams: Team[] = [];
      for (let i = 0; i < newGame.participants.length; i++) {
        teams[i] = newGame.participants[i].team;
      }
      expect(teams).toEqual(expect.arrayContaining(equalTeams));
      expect(newGame.turnTime).toEqual(0);
    });
  });
});
