import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-statistics-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './statistics-modal.html',
  styleUrls:['./statistics-modal.css']
})
export class StatisticsModal {
  @Input() title: string = 'Statistics';
  @Output() close = new EventEmitter<void>();
}
