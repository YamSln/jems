import { Participant } from "./participant.model";
import { Team } from "./team.model";
import { Word } from "./word.model";
import { WordsPack } from "./words-pack.model";

export interface GameState {
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
  turnInterval?: NodeJS.Timeout;
  password: string;
  maxPlayers: number;
  winningTeam?: Team;
}
