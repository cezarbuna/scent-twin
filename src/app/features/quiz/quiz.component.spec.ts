import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { QuizComponent } from './quiz.component';
import { AuthService } from '@core/services/auth.service';
import { SupabaseService } from '@core/services/supabase.service';

describe('QuizComponent', () => {
  let component: QuizComponent;
  let fixture: ComponentFixture<QuizComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let supabaseService: jasmine.SpyObj<SupabaseService>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['currentUser'], {
      currentUser: signal({
        id: 'test-user-id',
        email: 'test@example.com'
      })
    });
    
    const mockSupabaseClient = jasmine.createSpyObj('SupabaseClient', ['from']);
    const supabaseServiceSpy = jasmine.createSpyObj('SupabaseService', ['getClient']);
    supabaseServiceSpy.getClient.and.returnValue(mockSupabaseClient);

    await TestBed.configureTestingModule({
      imports: [QuizComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceSpy },
        { provide: SupabaseService, useValue: supabaseServiceSpy },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    supabaseService = TestBed.inject(SupabaseService) as jasmine.SpyObj<SupabaseService>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with step 0', () => {
    expect(component.currentStep()).toBe(0);
  });

  it('should toggle option when clicked', () => {
    const option = component.intendedContexts[0];
    expect(option.selected).toBe(false);
    
    component.toggleOption(component.intendedContexts, option);
    expect(option.selected).toBe(true);
    
    component.toggleOption(component.intendedContexts, option);
    expect(option.selected).toBe(false);
  });

  it('should select single option and deselect others', () => {
    const options = component.projectionOptions;
    const option1 = options[0];
    const option2 = options[1];
    
    component.selectSingleOption(options, option1);
    expect(option1.selected).toBe(true);
    expect(option2.selected).toBe(false);
    
    component.selectSingleOption(options, option2);
    expect(option1.selected).toBe(false);
    expect(option2.selected).toBe(true);
  });

  it('should move to next step when valid', () => {
    component.intendedContexts[0].selected = true;
    expect(component.canProceed).toBe(true);
    
    component.nextStep();
    expect(component.currentStep()).toBe(1);
  });

  it('should not move to next step when invalid', () => {
    // No options selected
    expect(component.canProceed).toBe(false);
    
    component.nextStep();
    expect(component.currentStep()).toBe(0);
    expect(component.errorMessage()).toBeTruthy();
  });

  it('should move to previous step', () => {
    component.currentStep.set(2);
    
    component.previousStep();
    expect(component.currentStep()).toBe(1);
  });

  it('should track note likes and dislikes separately', () => {
    // Set up like selections
    component.currentStep.set(4);
    const note1 = component.noteOptions[0];
    const note2 = component.noteOptions[1];
    
    component.toggleOption(component.noteOptions, note1);
    component.toggleOption(component.noteOptions, note2);
    
    // Move to next step which saves likes
    component.nextStep();
    
    expect(component.noteLikesSelected.length).toBe(2);
    expect(component.currentStep()).toBe(5);
  });
});
