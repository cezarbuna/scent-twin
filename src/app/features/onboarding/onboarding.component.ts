import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseTestService } from '@core/services/supabase-test.service';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './onboarding.component.html',
  styleUrl: './onboarding.component.css'
})
export class OnboardingComponent implements OnInit {
  testResult: any = null;
  isLoading = false;

  constructor(private supabaseTest: SupabaseTestService) {}

  ngOnInit(): void {
    console.log('🚀 Onboarding component loaded');
    console.log('💡 Tip: Open browser console (F12) to see test results');
  }

  async testConnection() {
    this.isLoading = true;
    console.log('\n========================================');
    console.log('🧪 SUPABASE CONNECTION TEST');
    console.log('========================================\n');

    // Show config (safe info)
    const config = this.supabaseTest.getConfigInfo();
    console.log('📋 Configuration:');
    console.log('  URL:', config.url);
    console.log('  API Key Length:', config.keyLength, 'characters');
    console.log('  Configured:', config.configured ? '✅' : '❌');
    console.log('');

    // Test connection
    this.testResult = await this.supabaseTest.testConnection();
    console.log('\n📊 Test Result:', this.testResult);

    // Test auth
    const authResult = await this.supabaseTest.testAuth();
    console.log('\n🔐 Auth Test:', authResult);

    console.log('\n========================================');
    console.log(this.testResult.success ? '✅ TEST PASSED' : '❌ TEST FAILED');
    console.log('========================================\n');

    this.isLoading = false;
  }
}
