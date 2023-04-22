import { Player } from "./player.model";
import { Team } from "./team.model";
import { Word } from "./word.model";
import { WordsPack } from "./words-pack.model";

export interface Game {
  roomId?: string;
  players: Player[];
  sapphirePlayers: number;
  rubyPlayers: number;
  words: Word[];
  wordsPacks: WordsPack[];
  currentTeam: Team;
  sapphirePoints: number;
  rubyPoints: number;
  turnTime: number;
  currentTime: number;
  maxPlayers: number;
  winningTeam?: Team;
}

export interface GameState extends Game {
  turnInterval?: NodeJS.Timeout;
  password: string;
}
