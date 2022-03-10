import { Team } from './team.model';

export interface WordClicked {
  wordIndex: number;
  winningTeam?: Team;
}
