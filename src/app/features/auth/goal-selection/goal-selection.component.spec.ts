import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { GoalSelectionComponent } from './goal-selection.component';
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

describe('GoalSelectionComponent', () => {
  let component: GoalSelectionComponent;
  let fixture: ComponentFixture<GoalSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoalSelectionComponent],
      providers: [
        provideRouter([]),
        AuthService,
        { provide: SupabaseService, useClass: MockSupabaseService }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GoalSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
