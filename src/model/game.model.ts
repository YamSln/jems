import { Participant } from "./participant.model";
import { Team } from "./team.model";
import { Word } from "./word.model";
import { WordsPack } from "./words-pack.model";

export interface Game {
  roomId?: string;
  participants: Participant[];
  blueTeamPlayers: number;
  redTeamPlayers: number;
  words: Word[];
  wordsPacks: WordsPack[];
  currentTeam: Team;
  blueTeamPoints: number;
  redTeamPoints: number;
  turnTime: number;
  currentTime: number;
  maxPlayers: number;
  winningTeam?: Team;
}

export interface GameState extends Game {
  turnInterval?: NodeJS.Timeout;
  password: string;
}
