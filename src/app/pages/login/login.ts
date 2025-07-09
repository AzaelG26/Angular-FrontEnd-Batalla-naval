import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth-service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  form!: FormGroup
  errorMessage: string | null = null;
  crimsonBackgroundStyle = {
    background:'radial-gradient(115% 120% at 50% 100%, #000000 40%, rgb(237, 0, 0)100%)',
    backgroundAttachment: 'fixed',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  };

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}
  ngOnInit() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  get email() {
    return this.form.get('email');
  }
  get password() {
    return this.form.get('password');
  }

  onLogin() {
    this.errorMessage = null; 
    
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password } = this.form.value;
    this.authService.login(email, password).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        const res = err?.error;
        if (Array.isArray(res?.errors)) {
          for (const e of res.errors) {
            if (e.field === 'email') {
              this.email?.setErrors({ custom: e.message });
            } else if (e.field === 'password') {
              this.password?.setErrors({ custom: e.message });
            } else if (e.message === 'Invalid user credentials') {
              this.form.setErrors({ credentials: e.message });
            } else {
              this.form.setErrors({ general: 'Invalid credentials' });
            }
          }
        } else {
          this.errorMessage = 'Unexpected error occurred.';
        }
      }
    });
  }

}
