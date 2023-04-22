import { GameState } from "../model/game.model";
import { Player } from "../model/player.model";
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
  currentGame?: GameState,
): GameState => {
  // Get starting team
  const startingTeam: Team = getRandomTeam();
  // Get random words
  const words: Word[] = generateWords(startingTeam, WORDS_COUNT);
  const players: {
    players: Player[];
    sapphirePlayers: number;
    rubyPlayers: number;
  } = currentGame
    ? shuffleAndResetPlayers(currentGame.players)
    : { players: [], sapphirePlayers: 0, rubyPlayers: 0 };
  // Generate new game
  const game: GameState = {
    ...currentGame,
    currentTeam: startingTeam,
    sapphirePoints:
      startingTeam === Team.SAPPHIRE ? STARTING_TEAM_WORDS : OTHER_TEAM_WORDS,
    rubyPoints:
      startingTeam === Team.RUBY ? STARTING_TEAM_WORDS : OTHER_TEAM_WORDS,
    sapphirePlayers: players.sapphirePlayers,
    rubyPlayers: players.rubyPlayers,
    players: players.players,
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
  wordsCount: number = WORDS_COUNT,
): Word[] => {
  const wordsContent: string[] = getRandomWords(wordsCount);
  const words: Word[] = [];

  let startWordType: WordType;
  let otherWordType: WordType;
  if (startingTeam === Team.SAPPHIRE) {
    startWordType = WordType.SAPPHIRE;
    otherWordType = WordType.RUBY;
  } else {
    startWordType = WordType.RUBY;
    otherWordType = WordType.SAPPHIRE;
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

const shuffleAndResetPlayers = (
  players: Player[],
): {
  players: Player[];
  sapphirePlayers: number;
  rubyPlayers: number;
} => {
  let sapphirePlayers: number = 0;
  let rubyPlayers: number = 0;
  for (let player of players) {
    // Assign player to available team
    player.team = assignTeam(players.length, sapphirePlayers, rubyPlayers);
    // Count each team players
    player.team === Team.SAPPHIRE ? sapphirePlayers++ : rubyPlayers++;
    // Clear players role
    player.role = Role.JEMOLOGIST;
  }
  return { players, sapphirePlayers, rubyPlayers };
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
  sapphirePlayers: number,
  rubyPlayers: number,
): Team => {
  if (sapphirePlayers >= totalPlayers / 2) {
    return Team.RUBY;
  } else if (rubyPlayers >= totalPlayers / 2) {
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
