import { Player } from "../model/player.model";

export interface PlayerAction {
  nick: string;
  updatedPlayers: Player[];
}
