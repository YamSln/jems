import { Team } from "../model/team.model";

export interface WordClicked {
  wordIndex: number;
  winningTeam?: Team;
}
