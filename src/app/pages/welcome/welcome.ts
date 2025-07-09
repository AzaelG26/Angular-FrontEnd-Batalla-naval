import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './welcome.html',
})
export class WelcomeComponent {
  crimsonBackgroundStyle = {
    background: 'radial-gradient(125% 110% at 50% 100%, #000000 40%,rgb(60, 9, 9) 100%)',
    backgroundAttachment: 'fixed',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  };
}