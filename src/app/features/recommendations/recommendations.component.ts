import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '@core/services';

interface PerfumeRecommendation {
  id: string;
  name: string;
  brand: string;
  matchScore: number;
  description: string;
  notes: string[];
  price: number;
  isLocked: boolean;
  unlockMethod?: string;
}

@Component({
  selector: 'app-recommendations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recommendations.component.html',
  styleUrl: './recommendations.component.css'
})
export class RecommendationsComponent implements OnInit {
  recommendations = signal<PerfumeRecommendation[]>([]);
  isLoading = signal(true);
  freeRevealsLeft = signal(3);

  // Sample recommendations for now
  sampleRecommendations: PerfumeRecommendation[] = [
    {
      id: '1',
      name: 'Sauvage',
      brand: 'Dior',
      matchScore: 92,
      description: 'A magnetic woody fragrance with freshness and sensuality',
      notes: ['Bergamot', 'Pepper', 'Ambroxan', 'Lavender'],
      price: 85,
      isLocked: false,
    },
    {
      id: '2',
      name: 'Bleu de Chanel',
      brand: 'Chanel',
      matchScore: 88,
      description: 'A harmonious woody-aromatic fragrance',
      notes: ['Citrus', 'Mint', 'Ginger', 'Cedar'],
      price: 110,
      isLocked: false,
    },
    {
      id: '3',
      name: 'Acqua di Gio',
      brand: 'Giorgio Armani',
      matchScore: 85,
      description: 'A fresh aquatic fragrance',
      notes: ['Calabrian Bergamot', 'Marine Notes', 'Patchouli'],
      price: 75,
      isLocked: false,
    },
    {
      id: '4',
      name: 'Versace Eros',
      brand: 'Versace',
      matchScore: 90,
      description: 'A fresh oriental fougère fragrance',
      notes: ['Mint', 'Apple', 'Tonka Bean', 'Ambroxan'],
      price: 60,
      isLocked: true,
      unlockMethod: 'Complete a task to unlock'
    },
    {
      id: '5',
      name: 'Creed Aventus',
      brand: 'Creed',
      matchScore: 95,
      description: 'A fruity chypre fragrance',
      notes: ['Pineapple', 'Apple', 'Bergamot', 'Oak Moss'],
      price: 375,
      isLocked: true,
      unlockMethod: 'Premium subscription'
    }
  ];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadRecommendations();
  }

  loadRecommendations(): void {
    this.isLoading.set(true);
    
    // Simulate API call
    setTimeout(() => {
      this.recommendations.set(this.sampleRecommendations);
      this.isLoading.set(false);
    }, 1000);
  }

  unlockRecommendation(id: string): void {
    console.log('Unlocking recommendation:', id);
    // TODO: Implement unlock logic
  }

  viewDetails(id: string): void {
    console.log('Viewing details for:', id);
    // TODO: Navigate to perfume details page
  }
}
