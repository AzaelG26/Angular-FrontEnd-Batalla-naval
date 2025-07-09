import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private baseUrl = 'http://localhost:3333/games';
  constructor(private http: HttpClient) { }

  getGames() {
    return this.http.get<{ games: any[] }>(this.baseUrl);
  }

  createGame() {
    return this.http.post<{ game: any }>(this.baseUrl, {});
  }

  joinGame(gameId: number) {
    return this.http.put(`${this.baseUrl}/${gameId}`, {});
  }

  cancelGame(gameId: number) {
    return this.http.put(`${this.baseUrl}/${gameId}/cancel`, {});
  }
}