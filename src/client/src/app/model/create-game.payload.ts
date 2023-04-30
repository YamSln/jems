export interface CreateGamePayload {
  nick: string;
  password: string;
  maxPlayers: number;
  wordPacks: File[];
}
