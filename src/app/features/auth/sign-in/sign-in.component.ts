import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@core/services';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent {
  signInForm: FormGroup;
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  showPassword = signal(false);
  showForgotPassword = signal(false);
  resetEmailSent = signal(false);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [false]
    });
  }

  get email() {
    return this.signInForm.get('email');
  }

  get password() {
    return this.signInForm.get('password');
  }

  togglePasswordVisibility(): void {
    this.showPassword.set(!this.showPassword());
  }

  toggleForgotPasswordModal(): void {
    this.showForgotPassword.set(!this.showForgotPassword());
    this.resetEmailSent.set(false);
  }

  async onSubmit(): Promise<void> {
    if (this.signInForm.invalid) {
      this.signInForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { email, password } = this.signInForm.value;

    try {
      console.log('🔍 SignInComponent: Calling authService.signIn()');
      const result = await this.authService.signIn(email, password);
      console.log('🔍 SignInComponent: Received result:', result);

      if (result.success) {
        // Auth service handles navigation based on profile completion
        // No need to navigate here
      } else {
        console.log('🔍 SignInComponent: Sign in failed, error:', result.error);
        this.errorMessage.set(result.error || 'Failed to sign in. Please try again.');
      }
    } catch (error: any) {
      console.error('🔍 SignInComponent: Unexpected error:', error);
      this.errorMessage.set(error.message || 'An unexpected error occurred.');
    } finally {
      this.isLoading.set(false);
    }
  }

  async signInWithGoogle(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      const result = await this.authService.signInWithGoogle();

      if (!result.success && result.error) {
        this.errorMessage.set(result.error);
        this.isLoading.set(false);
      }
      // If successful, user will be redirected by OAuth flow
    } catch (error: any) {
      this.errorMessage.set(error.message || 'Failed to sign in with Google.');
      this.isLoading.set(false);
    }
  }

  async resetPassword(): Promise<void> {
    const email = this.email?.value;

    if (!email || this.email?.invalid) {
      this.errorMessage.set('Please enter a valid email address first.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      const result = await this.authService.resetPassword(email);

      if (result.success) {
        this.resetEmailSent.set(true);
      } else {
        this.errorMessage.set(result.error || 'Failed to send reset email.');
      }
    } catch (error: any) {
      this.errorMessage.set(error.message || 'An unexpected error occurred.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
