import { Game } from "../model/game.model";
import { Player } from "../model/player.model";

export interface JoinEvent {
  state: Game;
  joined: Player;
}
