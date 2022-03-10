import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CreateGamePayload } from '../model/create-game.payload';
import { CreateGameResponse } from '../model/create-game.response';
import { JoinGamePayload } from '../model/join-game.payload';

export const API_URL = environment.api;
export const CREATE_URL = `${API_URL}/create`;
export const JOIN_URL = `${API_URL}/join`;

@Injectable({
  providedIn: 'root',
})
export class GameService {
  constructor(private http: HttpClient) {}

  createGame(payload: CreateGamePayload): Observable<CreateGameResponse> {
    return this.http.post<CreateGameResponse>(CREATE_URL, payload);
  }

  join(payload: JoinGamePayload): Observable<string> {
    return this.http.post<string>(JOIN_URL, payload);
  }
}
