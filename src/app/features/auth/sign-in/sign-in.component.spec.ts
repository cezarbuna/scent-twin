import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SignInComponent } from './sign-in.component';
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
        signInWithPassword: () => Promise.resolve({ data: { user: null }, error: null }),
        signInWithOAuth: () => Promise.resolve({ data: {}, error: null }),
        resetPasswordForEmail: () => Promise.resolve({ error: null }),
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

describe('SignInComponent', () => {
  let component: SignInComponent;
  let fixture: ComponentFixture<SignInComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignInComponent],
      providers: [
        provideRouter([]),
        AuthService,
        { provide: SupabaseService, useClass: MockSupabaseService }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SignInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
