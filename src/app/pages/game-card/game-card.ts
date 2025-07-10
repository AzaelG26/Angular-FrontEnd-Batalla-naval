import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GameService } from '../../services/game-service';

type GameStatus = 'waiting' | 'playing' | 'finished';

@Component({
  selector: 'app-game-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-card.html',
  styleUrl: './game-card.css'
})

export class GameCard {
  @Input() game!: any;
  @Input() currentUserId!: number;
  @Output() join = new EventEmitter<number>();
  @Output() refresh = new EventEmitter<void>();
  constructor(private gameService: GameService) {}
  get statusColor(): string {
    const status = this.game.status as GameStatus;
    const colors: Record<GameStatus, string> = {
      waiting: 'text-yellow-600',
      playing: 'text-green-600',
      finished: 'text-gray-600',
    };
    return colors[status] || 'text-gray-600';
  }

  get statusText(): string {
    const status = this.game.status as GameStatus;
    const texts: Record<GameStatus, string> = {
      waiting: 'Waiting',
      playing: 'Playing',
      finished: 'Finished',
    };
    return texts[status] || status;
  }
  get isCreator(): boolean {
    const creatorId = this.game.boards[0]?.user?.id;
    return this.currentUserId === creatorId;
  }
  joinGame() {
    this.join.emit(this.game.id);
  }
  cancelGame() {
    this.gameService.cancelGame(this.game.id).subscribe({
      next: () => this.refresh.emit(),
      error: (err) => {
        console.error('No se pudo cancelar', err);
      },
    });
  }
}
