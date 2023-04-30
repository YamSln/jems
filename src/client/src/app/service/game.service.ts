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
    return this.http.post<CreateGameResponse>(
      CREATE_URL,
      this.formData(payload)
    );
  }

  join(payload: JoinGamePayload): Observable<string> {
    return this.http.post<string>(JOIN_URL, payload);
  }

  formData(payload: CreateGamePayload): FormData {
    const formData: FormData = new FormData();
    // Extract game data form payload
    const { wordPacks, ...gameData } = payload;
    // Set game data fields
    for (let key of Object.keys(gameData)) {
      formData.append(key, gameData[key]);
    }
    // Set word pack files
    for (let wordPack of payload.wordPacks) {
      formData.append('file', wordPack);
    }
    return formData;
  }
}
