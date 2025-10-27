import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Step {
  label: string;
  status: 'completed' | 'current' | 'upcoming';
}

@Component({
  selector: 'app-progress-stepper',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress-stepper.component.html',
  styleUrl: './progress-stepper.component.css'
})
export class ProgressStepperComponent {
  @Input() steps: Step[] = [];
  @Input() currentStep: number = 0;
}
