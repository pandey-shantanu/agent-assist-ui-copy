import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { AuthService } from './core/services/auth.service';
import { AngularSvgIconModule } from 'angular-svg-icon/lib/angular-svg-icon.module';
import { RoundProgressModule } from 'angular-svg-round-progressbar/round-progress/round-progress.module';
import { BrowserModule } from '@angular/platform-browser';

describe('AppComponent', () => {
  let app: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let mockAuthService;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj(["populateAuth"]);
    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: mockAuthService}],
      imports: [ RouterTestingModule, BrowserModule ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it(`should have as title 'agent-assist-ui'`, () => {
    expect(app.title).toEqual('agent-assist-ui');
  });
});
