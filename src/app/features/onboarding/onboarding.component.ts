import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate, stagger, query } from '@angular/animations';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './onboarding.component.html',
  styleUrl: './onboarding.component.css',
  animations: [
    // Fade in animation
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('600ms ease-out', style({ opacity: 1 }))
      ])
    ]),
    // Slide up animation
    trigger('slideUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('500ms {{delay}}ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ], { params: { delay: 0 } })
    ]),
    // Scale in animation for buttons
    trigger('scaleIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate('400ms {{delay}}ms cubic-bezier(0.34, 1.56, 0.64, 1)', style({ opacity: 1, transform: 'scale(1)' }))
      ], { params: { delay: 0 } })
    ]),
    // Stagger animation for lists
    trigger('staggerCards', [
      transition(':enter', [
        query('.animated-card', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(150, [
            animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class OnboardingComponent implements OnInit {
  // Control animation state
  showContent = false;

  // How it works steps
  steps = [
    {
      number: '1',
      icon: '📸',
      title: 'Selfie',
      subtitle: 'Optional',
      description: 'Quick color analysis on your device'
    },
    {
      number: '2',
      icon: '✨',
      title: 'Quiz',
      subtitle: '45 seconds',
      description: 'Share your preferences and lifestyle'
    },
    {
      number: '3',
      icon: '💎',
      title: 'Discover',
      subtitle: '3 free reveals',
      description: 'Get personalized recommendations'
    }
  ];

  // Privacy features
  privacyFeatures = [
    {
      icon: '🔒',
      title: 'Client-Side Processing',
      description: 'Your selfie never leaves your device. Only color analysis results are stored.'
    },
    {
      icon: '🗑️',
      title: 'Full Control',
      description: 'Delete your selfie data anytime with one tap. Complete transparency.'
    },
    {
      icon: '🔗',
      title: 'External Research',
      description: 'We link to Fragrantica for reviews. We respect their community and content.'
    }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Trigger entrance animations after a brief delay
    setTimeout(() => {
      this.showContent = true;
    }, 100);
  }

  /**
   * Navigate to authentication/signup
   */
  getStarted(): void {
    // Add haptic feedback if available
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
    
    this.router.navigate(['/auth']);
  }

  /**
   * Scroll to specific section
   */
  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
