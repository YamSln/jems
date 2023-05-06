import { GameState } from "../model/game.model";
import { Player } from "../model/player.model";
import { Role } from "../model/role.model";
import { Team } from "../model/team.model";
import { Word } from "../model/word.model";
import { WordType } from "../model/word.type";
import {
  OTHER_TEAM_WORDS,
  STARTING_TEAM_WORDS,
  WORDS_COUNT,
} from "../util/game.constants";

function newGame(currentGame: GameState, wordsSource: string[]): GameState {
  return createGame(
    currentGame.password,
    currentGame.maxPlayers,
    wordsSource,
    currentGame,
  );
}

function createGame(
  password: string,
  maxPlayers: number,
  wordsSource: string[],
  currentGame?: GameState,
): GameState {
  // Get starting team
  const startingTeam: Team = getRandomTeam();
  // Get random words
  const words: Word[] = generateWords(startingTeam, wordsSource, WORDS_COUNT);
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
    selectedWordPack: currentGame ? currentGame.selectedWordPack : 0,
    wordPacks: currentGame ? currentGame.wordPacks : [],
  }; // Return new game

  return game;
}

function generateWords(
  startingTeam: Team,
  wordsSource: string[],
  wordsCount: number = WORDS_COUNT,
): Word[] {
  const wordsContent: string[] = getRandomWords(wordsCount, wordsSource);
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
      id: Date.now(),
      index: 0,
      content: wordsContent[i],
      selected: false,
      type: wordType,
    };
    words.push(word);
  }
  return shuffleWords(words);
}

function getRandomWords(
  wordsCount: number = WORDS_COUNT,
  wordsSource: string[],
): string[] {
  const words: string[] = [];
  const indexes: number[] = [];
  while (words.length < wordsCount) {
    const random = getRandomNumber(wordsSource.length);
    // If word number does not taken, add new word in its index
    if (indexes.indexOf(random) === -1) {
      words.push(wordsSource[random - 1]);
      indexes.push(random);
    }
  }
  return words;
}

function shuffleWords(words: Word[]): Word[] {
  let currentIndex = words.length - 1;
  let temp;
  let random;
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
}

function shuffleAndResetPlayers(players: Player[]): {
  players: Player[];
  sapphirePlayers: number;
  rubyPlayers: number;
} {
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
}

function getRandomNumber(max: number): number {
  return Math.floor(Math.random() * max) + 1;
}

function getRandomTeam(): Team {
  const teams = Object.keys(Team);
  const randomIndex = getRandomNumber(teams.length);
  const randomTeam = teams[randomIndex - 1];
  return randomTeam as Team;
}

function assignTeam(
  totalPlayers: number,
  sapphirePlayers: number,
  rubyPlayers: number,
): Team {
  if (sapphirePlayers >= totalPlayers / 2) {
    return Team.RUBY;
  } else if (rubyPlayers >= totalPlayers / 2) {
    return Team.SAPPHIRE;
  }
  return getRandomTeam();
}

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
