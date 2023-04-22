import { Role } from "./role.model";
import { Team } from "./team.model";

export interface Player {
  id: string;
  nick: string;
  role: Role;
  team: Team;
}
