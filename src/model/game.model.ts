import { Participant } from "./participant.model";
import { Team } from "./team.model";
import { Word } from "./word.model";

export interface GameState {
  roomId?: string;
  participants: Participant[];
  words: Word[];
  currentTeam: Team;
  blueTeamPoints: number;
  redTeamPoints: number;
  turnTime: number;
  password: string;
  maxPlayers: number;
}
