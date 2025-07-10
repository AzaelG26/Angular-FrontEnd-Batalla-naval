import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-board.html',
  styleUrls: ['./game-board.css'],
})
export class GameBoardComponent {
  @Input() game: any;
  @Input() meId!: number;

  rows = ['A','B','C','D','E','F','G','H'];
  cols = ['1','2','3','4','5','6','7','8'];

  get myBoard() {
    return this.game?.boards?.find((b: any) => b.user.id === this.meId) || { grid: [] };
  }

  get opponentBoard() {
    return this.game?.boards?.find((b: any) => b.user.id !== this.meId) || { grid: [] };
  }

  get myMovesMap() {
    const map: Record<string, string> = {};
    this.game?.moves
      ?.filter((m: any) => m.userId === this.meId) // ← CORREGIDO
      .forEach((m: any) => {
        const pos = this.rows[m.x] + (m.y + 1);
        map[pos] = m.result;
      });
    return map;
  }

  get opponentMovesMap() {
    const map: Record<string, string> = {};
    this.game?.moves
      ?.filter((m: any) => m.userId !== this.meId) // ← CORREGIDO
      .forEach((m: any) => {
        const pos = this.rows[m.x] + (m.y + 1);
        map[pos] = m.result;
      });
    return map;
  }
}
