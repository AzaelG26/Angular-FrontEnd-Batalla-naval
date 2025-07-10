import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Subscription, switchMap } from 'rxjs';
import { GameService } from '../../services/game-service';
import { CommonModule } from '@angular/common';
import { GameCard } from '../game-card/game-card';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, GameCard],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  games: any[] = [];
  currentUserId: number | null = null;
  loading = false;
  error = '';
  pollingSub?: Subscription;
  constructor(
    private gameService: GameService,
    private authService: AuthService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.authService.validateSession().subscribe({
      next: (res) => {
        this.currentUserId = res.user.id;
        this.fetchGames();
        this.pollingSub = interval(3000)
          .pipe(switchMap(() => this.gameService.getGames()))
          .subscribe({
            next: (res) => (this.games = res.games),
            error: (err) => console.error(err),
          });
      },
      error: () => {
        this.error = 'Sesión no válida';
      },
    });
  }
  ngOnDestroy(): void {
    this.pollingSub?.unsubscribe();
  }
  fetchGames(): void {
    this.gameService.getGames().subscribe({
      next: (res) => (this.games = res.games),
      error: (err) => console.error(err),
    });
  }

  createGame(): void {
    this.loading = true;
    this.error = '';
    this.gameService.createGame().subscribe({
      next: (res) => {
        const gameId = res.game.id;
        this.router.navigate([`/dashboard/games/${gameId}`]); // redirige
      },
      error: () => {
        this.error = 'No se pudo crear el juego.';
      },
      complete: () => (this.loading = false),
    });
  }

  joinGame(gameId: number): void {
    console.log('JOIN GAME:', gameId);
    const game = this.games.find((g) => g.id === gameId);
    const playerIds = game.boards.map((b: any) => b.user.id);

    if (playerIds.includes(this.currentUserId)) {
    this.router.navigate([`/dashboard/games/${gameId}`]); // ← Asegúrate que esta ruta exista
  } else {
      this.gameService.joinGame(gameId).subscribe({
        next: () => this.router.navigate([`/dashboard/games/${gameId}`]), // ← CORREGIDO AQUÍ TAMBIÉN
        error: (err) => {
          this.error = err.error.message || 'No se pudo unir al juego';
        },
      });
    }
  }
}
