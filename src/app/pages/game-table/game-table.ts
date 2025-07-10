import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-table.html',
  styleUrls: ['./game-table.css'],
})
export class GameTableComponent {
  @Input() games: any[] = [];
  @Output() view = new EventEmitter<any>();
}
