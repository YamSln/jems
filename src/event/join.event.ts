import { Game } from "../model/game.model";
import { Participant } from "../model/participant.model";

export interface JoinEvent {
  state: Game;
  joined: Participant;
}
