import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '@core/services';

@Component({
  selector: 'app-selfie',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './selfie.component.html',
  styleUrl: './selfie.component.css'
})
export class SelfieComponent {
  isLoading = signal(false);
  hasCamera = signal(false);

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Check for camera access
    this.checkCameraAccess();
  }

  async checkCameraAccess(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.hasCamera.set(true);
      // Clean up the stream
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      this.hasCamera.set(false);
      console.log('Camera access denied or not available');
    }
  }

  startSelfieCapture(): void {
    // TODO: Implement camera capture
    console.log('Starting selfie capture...');
    this.router.navigate(['/quiz']);
  }

  skipSelfie(): void {
    this.router.navigate(['/quiz']);
  }
}
