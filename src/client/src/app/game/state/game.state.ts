import { Role } from 'src/app/model/role.model';
import { WordsPack } from 'src/app/model/words-pack.mode';
import { Participant } from '../../model/participant.model';
import { Team } from '../../model/team.model';
import { Word } from '../../model/word.model';

export interface GameState {
  roomId: string;
  participants: Participant[];
  words: Word[];
  wordsPacks: WordsPack[];
  currentTeam: Team;
  blueTeamPoints: number;
  redTeamPoints: number;
  turnTime: number;
  currentTime: number;
  maxPlayers: number;
  playerId: string;
  playerRole: Role;
  playerTeam: Team;
  winningTeam?: Team;
}

export const initialState: GameState = {
  roomId: '',
  participants: [],
  words: [],
  wordsPacks: [],
  currentTeam: Team.SAPPHIRE,
  blueTeamPoints: 0,
  redTeamPoints: 0,
  turnTime: 0,
  currentTime: 0,
  maxPlayers: 4,
  playerId: '',
  playerRole: Role.OPERATIVE,
  playerTeam: Team.SAPPHIRE,
};
