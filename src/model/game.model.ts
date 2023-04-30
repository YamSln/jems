import { Player } from "./player.model";
import { Team } from "./team.model";
import { Word } from "./word.model";

export interface Game {
  roomId?: string;
  players: Player[];
  sapphirePlayers: number;
  rubyPlayers: number;
  words: Word[];
  currentTeam: Team;
  sapphirePoints: number;
  rubyPoints: number;
  turnTime: number;
  currentTime: number;
  maxPlayers: number;
  wordPacks: string[];
  selectedWordPack: number;
  winningTeam?: Team;
}

export interface GameState extends Game {
  turnInterval?: NodeJS.Timeout;
  password: string;
}

export interface GamePack {
  state: GameState;
  wordsSource: string[];
}
