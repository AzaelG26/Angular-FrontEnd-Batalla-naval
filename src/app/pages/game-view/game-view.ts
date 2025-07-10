import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from '../../services/game-service';
import { AuthService } from '../../services/auth-service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-view.html',
  styleUrl: './game-view.css'
})
export class GameViewComponent implements OnInit, OnDestroy {
  gameData: any;
  polling: any;
  processingMove = false;
  error = '';
  redirecting = false;
  myHitsReceived: string[] = [];
  userId = 0;
  rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  cols = ['1', '2', '3', '4', '5', '6', '7', '8'];

  constructor(
    private gameService: GameService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const gameId = Number(this.route.snapshot.paramMap.get('id'));
    this.authService.validateSession().subscribe({
      next: (res) => {
        this.userId = res.user.id;
        this.fetchGame(gameId);
        this.polling = setInterval(() => this.fetchGame(gameId), 2000);
      },
      error: () => {
        this.error = 'Sesión no válida';
        this.redirecting = true;
        this.router.navigate(['/login']);
      }
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.polling);
  }

  get myGrid(): string[] {
    const board = this.gameData?.boards?.find((b: any) => b.user.id === this.userId);
    return board?.grid || [];
  }

  get isMyTurn(): boolean {
    return this.gameData?.current_turn === this.userId;
  }

  shootAt(row: string, col: string): void {
    if (this.processingMove || !this.isMyTurn) return;

    const x = this.rows.indexOf(row);
    const y = Number(col) - 1;

    const alreadyShot = this.gameData?.moves?.some(
      (m: any) => m.userId === this.userId && m.x === x && m.y === y
    );
    if (alreadyShot) {
      this.error = 'Ya disparaste en esta celda.';
      return;
    }

    this.processingMove = true;
    this.error = '';
    this.gameService.shoot(this.gameData.id, { x, y }).subscribe({
      next: () => this.fetchGame(this.gameData.id),
      error: err => {
        this.error = err.error?.error || 'Error al disparar.';
        this.processingMove = false;
      },
      complete: () => (this.processingMove = false)
    });
  }

  fetchGame(id: number): void {
    if (this.redirecting) return;

    this.gameService.getGame(id).subscribe({
      next: res => {
        const newGame = {
          ...res.game,
          current_turn: res.game.currentTurn,
          winner_id: res.game.winnerId,
        };

        const meId = this.userId;
        const myBoard = newGame.boards.find((b: any) => b.user.id === meId);
        const myHits = newGame.moves.filter((m: any) => m.result === 'hit' && m.userId !== meId);

        const myHitsNow = myHits.map((m: any) => {
          const row = this.rows[m.x];
          return row + (m.y + 1);
        });

        const prevHits = this.gameData?.moves?.filter((m: any) => m.result === 'hit' && m.userId !== meId) || [];
        const prevHitsNow = prevHits.map((m: any) => {
          const row = this.rows[m.x];
          return row + (m.y + 1);
        });

        const newHit = myHitsNow.find((pos: any) => !prevHitsNow.includes(pos));

        if (newHit && myBoard?.grid?.includes(newHit)) {
          Swal.fire({
            icon: 'warning',
            title: '🔥 You were hit',
            text: `¡They hit you at cell ${newHit}!`,
            confirmButtonText: 'Accept',
            background: '#0b0e23',
            color: '#fff',
            iconColor: '#ff9a26',
            confirmButtonColor: '#ff9a26',
          });
        }

        this.myHitsReceived = myHitsNow;
        this.gameData = newGame;

        if (newGame.status === 'finished') {
          this.redirecting = true;
          clearInterval(this.polling);

          const won = newGame.winner_id === meId;
          Swal.fire({
            icon: won ? 'success' : 'error',
            title: won ? '🏆 ¡You won!' : '💀 Has perdido',
            text: won ? 'All opponent ships have been destroyed.' : 'Your ships have been destroyed.',
            confirmButtonText: 'Accept',
            background: '#0b0e23',
            color: '#fff',
            iconColor: won ? '#2ecc71' : '#e74c3c',
            confirmButtonColor: won ? '#2ecc71' : '#e74c3c',
            timerProgressBar: true
          }).then(() => this.router.navigate(['/dashboard']));
        }
      },
      error: err => console.error(err)
    });
  }

  leaveGame(): void {
    Swal.fire({
      title: 'Do you want to leave the game?',
      text: 'The opponent will be declared the winner.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e74c3c',
      cancelButtonColor: '#3498db',
      confirmButtonText: 'yes, leave it',
      cancelButtonText: 'Cancel',
      background: '#0b0e23',
      color: '#fff'
    }).then(result => {
      if (result.isConfirmed) {
        this.gameService.leaveGame(this.gameData.id).subscribe({
          next: (res) => {
            Swal.fire({
              title: 'you left the game.',
              text: res.message,
              icon: 'info',
              confirmButtonText: 'Aceptar',
              background: '#0b0e23',
              color: '#fff'
            }).then(() => this.router.navigate(['/dashboard']));
          },
          error: (err) => {
            Swal.fire({
              title: 'Error',
              text: err.error?.message || 'Could not leave the game.',
              icon: 'error',
              confirmButtonText: 'Accept',
              background: '#0b0e23',
              color: '#fff'
            });
          }
        });
      }
    });
  }

  getMoveResult(row: string, col: string): string | null {
    if (!this.gameData?.moves) return null;

    const meId = this.userId;
    const x = this.rows.indexOf(row);
    const y = Number(col) - 1;

    return this.gameData.moves.find(
      (m: { userId: any; x: number; y: number }) =>
        m.userId === meId && m.x === x && m.y === y
    )?.result || null;
  }
}
