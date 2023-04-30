import { Role } from '../../../../../model/role.model';
import { Player } from '../../../../../model/player.model';
import { Team } from '../../../../../model/team.model';
import { Word } from '../../model/word.model';

export interface GameState {
  roomId: string;
  players: Player[];
  words: Word[];
  currentTeam: Team;
  sapphirePoints: number;
  rubyPoints: number;
  turnTime: number;
  currentTime: number;
  maxPlayers: number;
  playerId: string;
  playerRole: Role;
  playerTeam: Team;
  winningTeam?: Team;
  wordPacks: string[];
  selectedWordPack: number;
}

export const initialState: GameState = {
  roomId: '',
  players: [],
  words: [],
  currentTeam: Team.SAPPHIRE,
  sapphirePoints: 0,
  rubyPoints: 0,
  turnTime: 0,
  currentTime: 0,
  maxPlayers: 4,
  playerId: '',
  playerRole: Role.JEMOLOGIST,
  playerTeam: Team.SAPPHIRE,
  wordPacks: [],
  selectedWordPack: 0,
};
