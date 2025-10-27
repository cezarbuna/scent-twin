import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '@core/services';
import { ProgressStepperComponent, Step } from '@shared/components/progress-stepper/progress-stepper.component';
import { TooltipComponent } from '@shared/components/tooltip/tooltip.component';

interface Goal {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  description: string;
  selected: boolean;
}

@Component({
  selector: 'app-goal-selection',
  standalone: true,
  imports: [CommonModule, ProgressStepperComponent, TooltipComponent],
  templateUrl: './goal-selection.component.html',
  styleUrl: './goal-selection.component.css'
})
export class GoalSelectionComponent {
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  showEducation = signal(false);

  steps: Step[] = [
    { label: 'Create Account', status: 'completed' },
    { label: 'Select Goals', status: 'current' },
    { label: 'Selfie (Optional)', status: 'upcoming' },
    { label: 'Preferences Quiz', status: 'upcoming' },
    { label: 'Get Recommendations', status: 'upcoming' }
  ];

  goals: Goal[] = [
    {
      id: 'signature_scent',
      title: 'Signature Scent',
      subtitle: 'Your Personal Identity',
      icon: '✨',
      description: 'Find a unique fragrance that becomes your personal trademark',
      selected: false
    },
    {
      id: 'work_office',
      title: 'Work / Office',
      subtitle: 'Professional & Subtle',
      icon: '💼',
      description: 'Sophisticated scents perfect for professional environments',
      selected: false
    },
    {
      id: 'casual_day',
      title: 'Casual Day',
      subtitle: 'Everyday Versatile',
      icon: '☀️',
      description: 'Fresh, easy-to-wear fragrances for daily activities',
      selected: false
    },
    {
      id: 'date_night',
      title: 'Date Night',
      subtitle: 'Romantic & Intimate',
      icon: '❤️',
      description: 'Sensual, captivating scents for romantic occasions',
      selected: false
    },
    {
      id: 'night_out',
      title: 'Night Out',
      subtitle: 'Bold & Attention-Grabbing',
      icon: '🌙',
      description: 'Powerful fragrances that make a statement',
      selected: false
    },
    {
      id: 'gym_sport',
      title: 'Gym / Sport',
      subtitle: 'Fresh & Clean',
      icon: '💪',
      description: 'Light, refreshing scents for active lifestyles',
      selected: false
    },
    {
      id: 'gifting',
      title: 'Gifting',
      subtitle: 'For Others',
      icon: '🎁',
      description: 'Discover perfect fragrances to give as gifts',
      selected: false
    }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  get selectedGoals(): Goal[] {
    return this.goals.filter(g => g.selected);
  }

  get canProceed(): boolean {
    return this.selectedGoals.length > 0;
  }

  toggleGoal(goal: Goal): void {
    goal.selected = !goal.selected;
  }

  toggleEducation(): void {
    this.showEducation.set(!this.showEducation());
  }

  async saveGoalsAndContinue(): Promise<void> {
    if (!this.canProceed) {
      this.errorMessage.set('Please select at least one goal to continue.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      const goalIds = this.selectedGoals.map(g => g.id);
      const result = await this.authService.updateUserGoals(goalIds);

      if (result.success) {
        // Navigate to next step (selfie)
        this.router.navigate(['/selfie']);
      } else {
        this.errorMessage.set(result.error || 'Failed to save goals. Please try again.');
      }
    } catch (error: any) {
      this.errorMessage.set(error.message || 'An unexpected error occurred.');
    } finally {
      this.isLoading.set(false);
    }
  }

  skipForNow(): void {
    // Navigate to selfie without saving goals
    this.router.navigate(['/selfie']);
  }
}
