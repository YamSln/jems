import { GameState } from "../model/game.model";
import { Participant } from "../model/participant.model";
import { Role } from "../model/role.model";
import { Team } from "../model/team.model";
import { Word } from "../model/word.model";
import { WordType } from "../model/word.type";
import wordsBase from "../words/words.json";

const WORDS_COUNT = 25;
const STARTING_TEAM_WORDS = 9;
const OTHER_TEAM_WORDS = 8;

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
  // Generate new game
  const game: GameState = {
    ...currentGame,
    currentTeam: startingTeam,
    blueTeamPoints:
      startingTeam === Team.SAPPHIRE ? STARTING_TEAM_WORDS : OTHER_TEAM_WORDS,
    redTeamPoints:
      startingTeam === Team.RUBY ? STARTING_TEAM_WORDS : OTHER_TEAM_WORDS,
    participants: currentGame ? currentGame.participants : [],
    turnTime: 0,
    currentTime: 0,
    winningTeam: undefined,
    maxPlayers,
    password,
    words,
  }; // Return new game
  return game;
};

const generateWords = (
  startingTeam: Team,
  wordsCount: number = WORDS_COUNT
): Word[] => {
  // Get random words
  const wordsContent: string[] = getRandomWords(wordsCount);
  // Init words array
  const words: Word[] = [];
  // Set starting team and other team colors
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
    } // Create new word
    const word: Word = {
      index: 0,
      content: wordsContent[i],
      selected: false,
      type: wordType,
    }; // push to words array
    words.push(word);
  } // Shuffle words and return
  return shuffleWords(words);
};

const getRandomWords = (wordsCount: number = WORDS_COUNT): string[] => {
  const words: string[] = []; // Words array
  const indexes: number[] = []; // Random indexes array
  // Iterate given number of times
  while (words.length < wordsCount) {
    // Get gandom number
    const random = getRandomNumber(wordsBase.data.length);
    // If it does not taken, add new word in its index
    if (indexes.indexOf(random) === -1) {
      words.push(wordsBase.data[random]);
      indexes.push(random);
    }
  } // Return words array
  return words;
};

const shuffleWords = (words: Word[]): Word[] => {
  let currentIndex = words.length - 1,
    temp,
    random;
  while (currentIndex !== -1) {
    // Get random index
    random = Math.floor(Math.random() * currentIndex);
    // Set current index word to temp variable
    temp = words[currentIndex];
    // Swap word in random index with current index
    words[currentIndex] = words[random];
    words[random] = temp;
    // Set its index
    words[currentIndex].index = currentIndex;
    currentIndex--;
  } // Return shuffled words
  return words;
};

const shuffleAndResetParticipants = (
  participants: Participant[]
): Participant[] => {
  let currentIndex = participants.length - 1,
    temp,
    random;
  while (currentIndex !== -1) {
    // Get random index
    random = Math.floor(Math.random() * currentIndex);
    // Set current index participant to temp variable
    temp = participants[currentIndex];
    // Swap participant in random index with current index
    participants[currentIndex] = participants[random];
    participants[random] = temp;
    // Set role to OPERATIVE and random team
    participants[currentIndex].role = Role.OPERATIVE;
    participants[currentIndex].team =
      currentIndex % 2 === 0 ? Team.SAPPHIRE : Team.RUBY;
    currentIndex--;
  } // Return shuffled participants
  return participants;
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

export default {
  newGame,
  createGame,
  generateWords,
  getRandomWords,
  getRandomNumber,
  getRandomTeam,
  shuffleWords,
};
