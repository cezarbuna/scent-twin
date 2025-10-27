import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, SupabaseService } from '@core/services';
import { ProgressStepperComponent, Step } from '@shared/components/progress-stepper/progress-stepper.component';
import { trigger, transition, style, animate } from '@angular/animations';

interface QuizOption {
  id: string;
  label: string;
  icon?: string;
  description?: string;
  selected: boolean;
}

interface QuizData {
  intendedContexts: string[];
  climatePreferences: string[];
  projectionPreference?: string;
  longevityExpectation?: string;
  noteLikes: string[];
  noteDislikes: string[];
  budgetBand?: string;
  brandPreference?: string;
  sensitivityFlags: string[];
}

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule, ProgressStepperComponent],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.css',
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(20px)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'translateX(-20px)', opacity: 0 }))
      ])
    ])
  ]
})
export class QuizComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  private supabaseService = inject(SupabaseService);

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  currentStep = signal(0);
  showTooltip = signal<string | null>(null);
  
  // Separate arrays to track note likes and dislikes
  noteLikesSelected: string[] = [];
  noteDislikesSelected: string[] = [];

  steps: Step[] = [
    { label: 'Account', status: 'completed' },
    { label: 'Goals', status: 'completed' },
    { label: 'Selfie', status: 'completed' },
    { label: 'Quiz', status: 'current' },
    { label: 'Recommendations', status: 'upcoming' }
  ];

  // Quiz questions and options
  intendedContexts: QuizOption[] = [
    { id: 'office', label: 'Office / Work', icon: '💼', selected: false },
    { id: 'dates', label: 'Dates', icon: '❤️', selected: false },
    { id: 'nights_out', label: 'Nights Out', icon: '🌙', selected: false },
    { id: 'sport', label: 'Sport / Gym', icon: '💪', selected: false },
    { id: 'formal', label: 'Formal Events', icon: '🎩', selected: false },
    { id: 'casual_daily', label: 'Casual Daily', icon: '☀️', selected: false }
  ];

  climateOptions: QuizOption[] = [
    { id: 'warm', label: 'Warm', icon: '🌞', selected: false },
    { id: 'cold', label: 'Cold', icon: '❄️', selected: false },
    { id: 'humid', label: 'Humid', icon: '💧', selected: false },
    { id: 'dry', label: 'Dry', icon: '🏜️', selected: false }
  ];

  projectionOptions: QuizOption[] = [
    { id: 'subtle', label: 'Subtle', description: 'Just for me to enjoy', selected: false },
    { id: 'moderate', label: 'Moderate', description: 'Close conversations', selected: false },
    { id: 'loud', label: 'Loud', description: 'Fill the room', selected: false }
  ];

  longevityOptions: QuizOption[] = [
    { id: '2-4h', label: '2-4 hours', description: 'Fresh start', selected: false },
    { id: '4-8h', label: '4-8 hours', description: 'All day comfort', selected: false },
    { id: '8+h', label: '8+ hours', description: 'Long lasting', selected: false }
  ];

  noteOptions: QuizOption[] = [
    { id: 'citrus', label: 'Citrus', icon: '🍋', selected: false },
    { id: 'florals', label: 'Florals', icon: '🌸', selected: false },
    { id: 'woods', label: 'Woods', icon: '🌲', selected: false },
    { id: 'musk', label: 'Musk', icon: '🌿', selected: false },
    { id: 'amber', label: 'Amber', icon: '🔥', selected: false },
    { id: 'vanilla', label: 'Vanilla', icon: '🍦', selected: false },
    { id: 'incense', label: 'Incense', icon: '🕯️', selected: false },
    { id: 'green', label: 'Green', icon: '🌱', selected: false },
    { id: 'aquatic', label: 'Aquatic', icon: '🌊', selected: false },
    { id: 'fruity', label: 'Fruity', icon: '🍑', selected: false },
    { id: 'spice', label: 'Spice', icon: '🌶️', selected: false },
    { id: 'gourmand', label: 'Gourmand', icon: '🍰', selected: false }
  ];

  budgetOptions: QuizOption[] = [
    { id: 'affordable', label: 'Affordable', description: 'Under $50', selected: false },
    { id: 'mid-range', label: 'Mid-Range', description: '$50-$150', selected: false },
    { id: 'luxury', label: 'Luxury', description: '$150+', selected: false }
  ];

  brandOptions: QuizOption[] = [
    { id: 'niche', label: 'Niche', description: 'Unique & exclusive', selected: false },
    { id: 'designer', label: 'Designer', description: 'Popular & recognizable', selected: false },
    { id: 'no_preference', label: 'No Preference', description: 'Open to everything', selected: false }
  ];

  sensitivityOptions: QuizOption[] = [
    { id: 'strong_florals', label: 'Strong Florals', selected: false },
    { id: 'synthetic_musks', label: 'Synthetic Musks', selected: false },
    { id: 'aldehydes', label: 'Aldehydes', selected: false },
    { id: 'animalic_notes', label: 'Animalic Notes', selected: false }
  ];

  constructor() {
    // Initialize quiz data with existing user profile if available
  }

  get stepTitles(): string[] {
    return [
      'Where will you wear it?',
      'What climate do you live in?',
      'How noticeable should it be?',
      'How long should it last?',
      'Which notes do you enjoy?',
      'Any notes to avoid?',
      'What\'s your budget?',
      'Designer or Niche?',
      'Any sensitivities? (Optional)'
    ];
  }

  get currentStepTitle(): string {
    return this.stepTitles[this.currentStep()];
  }

  get canProceed(): boolean {
    const step = this.currentStep();
    if (step === 0) return this.intendedContexts.some(opt => opt.selected);
    if (step === 1) return this.climateOptions.some(opt => opt.selected);
    if (step === 2) return this.projectionOptions.some(opt => opt.selected);
    if (step === 3) return this.longevityOptions.some(opt => opt.selected);
    if (step === 4) return true; // Can skip note likes
    if (step === 5) return true; // Can skip note dislikes
    if (step === 6) return this.budgetOptions.some(opt => opt.selected);
    if (step === 7) return this.brandOptions.some(opt => opt.selected);
    if (step === 8) return true; // Optional sensitivity
    return false;
  }

  toggleOption(options: QuizOption[], option: QuizOption): void {
    option.selected = !option.selected;
  }

  selectSingleOption(options: QuizOption[], selectedOption: QuizOption): void {
    options.forEach(opt => opt.selected = opt === selectedOption);
  }

  nextStep(): void {
    if (!this.canProceed) {
      this.errorMessage.set('Please select an option to continue');
      return;
    }

    // Before moving to next step, save state for likes/dislikes if needed
    if (this.currentStep() === 4) {
      // Save current selections as likes
      this.noteLikesSelected = this.noteOptions.filter(opt => opt.selected).map(opt => opt.id);
      // Clear selections for next step
      this.noteOptions.forEach(opt => opt.selected = false);
    } else if (this.currentStep() === 5) {
      // Save current selections as dislikes
      this.noteDislikesSelected = this.noteOptions.filter(opt => opt.selected).map(opt => opt.id);
      // Clear selections for next step
      this.noteOptions.forEach(opt => opt.selected = false);
    }

    if (this.currentStep() < this.stepTitles.length - 1) {
      this.currentStep.set(this.currentStep() + 1);
      this.errorMessage.set(null);
    } else {
      this.submitQuiz();
    }
  }

  previousStep(): void {
    if (this.currentStep() > 0) {
      const newStep = this.currentStep() - 1;
      
      // When going back, restore selected notes if applicable
      if (newStep === 4) {
        // Restore likes
        this.noteOptions.forEach(opt => {
          opt.selected = this.noteLikesSelected.includes(opt.id);
        });
      } else if (newStep === 5) {
        // Restore dislikes
        this.noteOptions.forEach(opt => {
          opt.selected = this.noteDislikesSelected.includes(opt.id);
        });
      }
      
      this.currentStep.set(newStep);
      this.errorMessage.set(null);
    }
  }

  private collectQuizData(): QuizData {
    return {
      intendedContexts: this.intendedContexts.filter(opt => opt.selected).map(opt => opt.id),
      climatePreferences: this.climateOptions.filter(opt => opt.selected).map(opt => opt.id),
      projectionPreference: this.projectionOptions.find(opt => opt.selected)?.id,
      longevityExpectation: this.longevityOptions.find(opt => opt.selected)?.id,
      noteLikes: this.noteLikesSelected,
      noteDislikes: this.noteDislikesSelected,
      budgetBand: this.budgetOptions.find(opt => opt.selected)?.id,
      brandPreference: this.brandOptions.find(opt => opt.selected)?.id,
      sensitivityFlags: this.sensitivityOptions.filter(opt => opt.selected).map(opt => opt.id)
    };
  }

  async submitQuiz(): Promise<void> {
    const quizData = this.collectQuizData();
    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      const user = this.authService.currentUser();
      if (!user) {
        this.errorMessage.set('Please log in to save your preferences');
        return;
      }

      // Update user profile with quiz data
      const { error } = await this.supabaseService.getClient()
        .from('user_profiles')
        .update({
          intended_contexts: quizData.intendedContexts,
          climate_preferences: quizData.climatePreferences,
          projection_preference: quizData.projectionPreference,
          longevity_expectation: quizData.longevityExpectation,
          note_likes: quizData.noteLikes,
          note_dislikes: quizData.noteDislikes,
          budget_band: quizData.budgetBand,
          brand_preference: quizData.brandPreference,
          sensitivity_flags: quizData.sensitivityFlags,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) {
        this.errorMessage.set(error.message || 'Failed to save quiz data');
        return;
      }

      // Navigate to recommendations
      this.router.navigate(['/recommendations']);
    } catch (error: any) {
      this.errorMessage.set(error.message || 'An unexpected error occurred');
    } finally {
      this.isLoading.set(false);
    }
  }

  toggleTooltip(step: string): void {
    this.showTooltip.set(this.showTooltip() === step ? null : step);
  }

  getCurrentStepOptions(): QuizOption[] {
    const step = this.currentStep();
    if (step === 0) return this.intendedContexts;
    if (step === 1) return this.climateOptions;
    if (step === 2) return this.projectionOptions;
    if (step === 3) return this.longevityOptions;
    if (step === 4) return this.noteOptions;
    if (step === 5) return this.noteOptions;
    if (step === 6) return this.budgetOptions;
    if (step === 7) return this.brandOptions;
    if (step === 8) return this.sensitivityOptions;
    return [];
  }
}
