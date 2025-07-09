import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  form!: FormGroup;
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
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }
  get fullName() { return this.form.get('fullName'); }
  get email() { return this.form.get('email'); }
  get password() { return this.form.get('password'); }
  get confirmPassword() { return this.form.get('confirmPassword'); }

  passwordMatchValidator(form: FormGroup): ValidationErrors | null {
    const pass = form.get('password')?.value;
    const confirm = form.get('confirmPassword')?.value;
    return pass === confirm ? null : { mismatch: true };
  }

  onRegister() {
    this.errorMessage = null;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { fullName, email, password } = this.form.value;

    this.authService.register(fullName, email, password).subscribe({
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
            } else if (e.field === 'fullName') {
              this.fullName?.setErrors({ custom: e.message });
            } else {
              this.form.setErrors({ general: 'Registration failed' });
            }
          }
        } else {
          this.errorMessage = res?.message || 'An unexpected error occurred';
        }
      }
    });
  }

}
