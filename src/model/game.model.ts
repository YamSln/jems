import { Participant } from "./participant.model";
import { Team } from "./team.model";
import { Word } from "./word.model";

export interface GameState {
  roomId?: string;
  participants: Participant[];
  blueTeamPlayers: number;
  redTeamPlayers: number;
  words: Word[];
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
