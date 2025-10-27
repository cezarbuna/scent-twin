import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SignUpComponent } from './sign-up.component';
import { AuthService } from '@core/services/auth.service';
import { SupabaseService } from '@core/services';

// Mock SupabaseService
class MockSupabaseService {
  getClient() {
    return {
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signUp: () => Promise.resolve({ data: { user: null }, error: null }),
        signInWithOAuth: () => Promise.resolve({ data: {}, error: null }),
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: null, error: null })
          }),
          limit: () => Promise.resolve({ data: null, error: { message: 'Table not found' } })
        }),
        insert: () => Promise.resolve({ error: null }),
        update: () => ({
          eq: () => Promise.resolve({ error: null })
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

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignUpComponent],
      providers: [
        provideRouter([]),
        AuthService,
        { provide: SupabaseService, useClass: MockSupabaseService }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
