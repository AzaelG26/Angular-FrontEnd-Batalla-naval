import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GameService} from '../../services/game-service';
import {StatisticsModal} from '../statistics-modal/statistics-modal';
import {GameTableComponent} from '../game-table/game-table';
import {GameBoardComponent} from '../game-board/game-board';
import {AuthService} from '../../services/auth-service';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule,
    StatisticsModal,
    GameTableComponent,
    GameBoardComponent],
  templateUrl: './statistics.html',
  styleUrls: ['./statistics.css']
})
export class StatisticsComponent {
  wins = 0;
  losses = 0;
  meId = 0

  showModal = false;
  selectedType: 'won' | 'lost' | null = null;
  modalContent: 'table' | 'board' = 'table';

  gamesList: any[] = [];
  selectedGame: any = null;

  constructor(private gameService: GameService, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.validateSession().subscribe({
      next: (res) => {
        this.meId = res.user.id;

        this.gameService.getStats().subscribe({
          next: (res: { wins: number; losses: number }) => {
            this.wins = res.wins;
            this.losses = res.losses;
          },
          error: (err: any) => console.error('Error loading stats:', err),
        });
      },
      error: (err) => console.error('Error loading user session:', err),
    });
  }

  get data() {
    return [
      { label: 'Wins', value: this.wins, color: 'rgb(255,0,0)' },
      { label: 'Losses', value: this.losses, color: 'rgb(0,0,0)' },
    ];
  }

  get maxValue() {
    return Math.max(...this.data.map(d => d.value), 1);
  }

  open(type: 'won' | 'lost') {
    this.selectedType = type;
    this.modalContent = 'table';
    this.showModal = true;
    this.loadGames(type);
  }

  loadGames(type: 'won' | 'lost') {
    this.gameService.getGamesByResult(type).subscribe({
      next: (res: { results: any[] }) => {
        this.gamesList = res.results;
      },
      error: (err: any) => console.error('Error loading games:', err),
    });
  }

  viewGame(game: any) {
    this.gameService.getGame(game.id).subscribe({
      next: (res: { game: any }) => {
        console.log('Game loaded:', res.game);
        this.selectedGame = res.game;
        this.modalContent = 'board';
      },
      error: (err: any) => console.error('Error loading game:', err),
    });
  }

  closeModal() {
    this.showModal = false;
    this.selectedType = null;
    this.gamesList = [];
    this.selectedGame = null;
  }
}
