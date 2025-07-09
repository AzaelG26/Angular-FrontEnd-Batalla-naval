import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterOutlet],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class layoutComponent {
  sidebarOpen = window.innerWidth >= 768; // visible en md+

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    const width = (event.target as Window).innerWidth;
    if (width >= 768) {
      this.sidebarOpen = true;
    }
  }
}
