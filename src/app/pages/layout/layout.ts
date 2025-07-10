import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class layoutComponent {
  sidebarOpen = window.innerWidth >= 768;

  constructor(private authService: AuthService, private router: Router) {}

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

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
      },
      error: () => {
        // fallback por si el backend no responde bien
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
      }
    });
  }
}
