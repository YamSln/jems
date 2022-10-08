import { GameState } from "../model/game.model";
import { Participant } from "../model/participant.model";
import { Role } from "../model/role.model";
import { Team } from "../model/team.model";
import { Word } from "../model/word.model";
import { WordType } from "../model/word.type";
import wordsBase from "../words/words.json";
import { v4 as uuidv4 } from "uuid";

const WORDS_COUNT = 25;
const STARTING_TEAM_WORDS = 9;
const OTHER_TEAM_WORDS = 8;
const DEFAULT_WORDS_PACK_NAME = "Classic";
const DEFAULT_WORDS_PACK_ID = uuidv4();

const newGame = (currentGame: GameState): GameState => {
  return createGame(currentGame.password, currentGame.maxPlayers, currentGame);
};

const createGame = (
  password: string,
  maxPlayers: number,
  currentGame?: GameState
): GameState => {
  // Get starting team
  const startingTeam: Team = getRandomTeam();
  // Get random words
  const words: Word[] = generateWords(startingTeam, WORDS_COUNT);
  const players: {
    participants: Participant[];
    blueTeamPlayers: number;
    redTeamPlayers: number;
  } = currentGame
    ? shuffleAndResetParticipants(currentGame.participants)
    : { participants: [], blueTeamPlayers: 0, redTeamPlayers: 0 };
  // Generate new game
  const game: GameState = {
    ...currentGame,
    currentTeam: startingTeam,
    blueTeamPoints:
      startingTeam === Team.SAPPHIRE ? STARTING_TEAM_WORDS : OTHER_TEAM_WORDS,
    redTeamPoints:
      startingTeam === Team.RUBY ? STARTING_TEAM_WORDS : OTHER_TEAM_WORDS,
    blueTeamPlayers: players.blueTeamPlayers,
    redTeamPlayers: players.redTeamPlayers,
    participants: players.participants,
    turnTime: 0,
    currentTime: 0,
    winningTeam: undefined,
    turnInterval: undefined,
    maxPlayers,
    password,
    words,
    wordsPacks: [
      {
        // Default words pack
        id: DEFAULT_WORDS_PACK_ID,
        name: DEFAULT_WORDS_PACK_NAME,
        selected: true,
      },
    ],
  }; // Return new game
  return game;
};

const generateWords = (
  startingTeam: Team,
  wordsCount: number = WORDS_COUNT
): Word[] => {
  const wordsContent: string[] = getRandomWords(wordsCount);
  const words: Word[] = [];

  let startWordType: WordType;
  let otherWordType: WordType;
  if (startingTeam === Team.SAPPHIRE) {
    startWordType = WordType.BLUE;
    otherWordType = WordType.RED;
  } else {
    startWordType = WordType.RED;
    otherWordType = WordType.BLUE;
  } // Set word type
  for (let i = 0; i < wordsCount; i++) {
    let wordType: WordType;
    if (i < STARTING_TEAM_WORDS) {
      wordType = startWordType;
    } else if (i < STARTING_TEAM_WORDS + OTHER_TEAM_WORDS) {
      wordType = otherWordType;
    } else if (i === STARTING_TEAM_WORDS + OTHER_TEAM_WORDS + 1) {
      wordType = WordType.BOMB;
    } else {
      wordType = WordType.NEUTRAL;
    }
    const word: Word = {
      index: 0,
      content: wordsContent[i],
      selected: false,
      type: wordType,
    };
    words.push(word);
  }
  return shuffleWords(words);
};

const getRandomWords = (wordsCount: number = WORDS_COUNT): string[] => {
  const words: string[] = [];
  const indexes: number[] = [];
  while (words.length < wordsCount) {
    const random = getRandomNumber(wordsBase.data.length);
    // If word number does not taken, add new word in its index
    if (indexes.indexOf(random) === -1) {
      words.push(wordsBase.data[random - 1]);
      indexes.push(random);
    }
  }
  return words;
};

const shuffleWords = (words: Word[]): Word[] => {
  let currentIndex = words.length - 1,
    temp,
    random;
  while (currentIndex !== -1) {
    // Get random index
    random = Math.floor(Math.random() * currentIndex);
    // Swap
    temp = words[currentIndex];
    words[currentIndex] = words[random];
    words[random] = temp;
    // Set new index
    words[currentIndex].index = currentIndex;
    currentIndex--;
  }
  return words;
};

const shuffleAndResetParticipants = (
  participants: Participant[]
): {
  participants: Participant[];
  blueTeamPlayers: number;
  redTeamPlayers: number;
} => {
  let blueTeamPlayers: number = 0;
  let redTeamPlayers: number = 0;
  for (let player of participants) {
    // Assign player to available team
    player.team = assignTeam(
      participants.length,
      blueTeamPlayers,
      redTeamPlayers
    );
    // Count each team players
    player.team === Team.SAPPHIRE ? blueTeamPlayers++ : redTeamPlayers++;
    // Clear players role
    player.role = Role.OPERATIVE;
  }
  return { participants, blueTeamPlayers, redTeamPlayers };
};

const getRandomNumber = (max: number): number => {
  return Math.floor(Math.random() * max) + 1;
};

const getRandomTeam = (): Team => {
  const teams = Object.keys(Team);
  const randomIndex = getRandomNumber(teams.length);
  const randomTeam = teams[randomIndex - 1];
  return randomTeam as Team;
};

const assignTeam = (
  totalPlayers: number,
  blueTeamPlayers: number,
  redTeamPlayers: number
): Team => {
  if (blueTeamPlayers >= totalPlayers / 2) {
    return Team.RUBY;
  } else if (redTeamPlayers >= totalPlayers / 2) {
    return Team.SAPPHIRE;
  }
  return getRandomTeam();
};

export default {
  newGame,
  createGame,
  generateWords,
  getRandomWords,
  getRandomNumber,
  getRandomTeam,
  assignTeam,
  shuffleWords,
};
