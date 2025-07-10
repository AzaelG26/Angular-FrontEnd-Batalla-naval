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
  getGame(id: number): Observable<{ game: any }> {
    return this.http.get<{ game: any }>(`${this.baseUrl}/${id}`)
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
  shoot(gameId: number, payload: { x: number; y: number }): Observable<any> {
    return this.http.post(`${this.baseUrl}/${gameId}/moves`, payload)
  }

  leaveGame(gameId: number): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/${gameId}/leave`, {})
  }

  getStats() {
    return this.http.get<{ wins: number; losses: number }>('http://localhost:3333/api/games-played');
  }

  getGamesByResult(type: 'won' | 'lost') {
    return this.http.get<{ results: any[] }>('http://localhost:3333/api/games-played/results', {
      params: { type }
    });
  }
}
