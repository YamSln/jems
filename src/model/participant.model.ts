import { Role } from "./role.model";
import { Team } from "./team.model";

export interface Participant {
  id: string;
  nick: string;
  role: Role;
  team: Team;
}
