import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { OnboardingComponent } from './onboarding.component';
import { SupabaseTestService } from '@core/services/supabase-test.service';
import { SupabaseService } from '@core/services';

// Mock SupabaseService
class MockSupabaseService {
  getClient() {
    return {
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      },
      from: () => ({
        select: () => ({
          limit: () => Promise.resolve({ data: null, error: { message: 'Table not found' } })
        })
      })
    };
  }
  async getSession() {
    return null;
  }
  async getCurrentUser() {
    return null;
  }
  onAuthStateChange() {
    return { data: { subscription: { unsubscribe: () => {} } } };
  }
}

describe('OnboardingComponent', () => {
  let component: OnboardingComponent;
  let fixture: ComponentFixture<OnboardingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnboardingComponent],
      providers: [
        provideRouter([]),
        { provide: SupabaseService, useClass: MockSupabaseService },
        SupabaseTestService
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnboardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
