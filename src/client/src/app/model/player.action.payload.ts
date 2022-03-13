import { Participant } from './participant.model';

export interface PlayerAction {
  nick: string;
  updatedPlayers: Participant[];
}
