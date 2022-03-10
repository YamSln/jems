import { GameState } from "../model/game.model";
import { Participant } from "../model/participant.model";

export interface JoinEvent {
  state: GameState;
  joined: Participant;
}
