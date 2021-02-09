import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AuthService } from '../core/services/auth.service';
import { EnvService } from '../core/services/env.service';
import { fromEvent as realFromEvent } from "rxjs";
import { LandingComponent } from './landing.component';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserModule } from '@angular/platform-browser';

describe('LandingComponent', () => {
  let component: LandingComponent;
  let fixture: ComponentFixture<LandingComponent>;
  let mockAuthService;
  let mockEnvService;

  beforeEach(() => {
    mockAuthService = {
      ...jasmine.createSpyObj("AuthService", ["completeAuthentication", "cleanAuth"]),
      isAuthenticated: of(true)
    };
    mockEnvService = jasmine.createSpyObj(["GetEnvName", "GetWebsocketServiceUrl"]);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule, BrowserModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: EnvService, useValue: mockEnvService }
      ],
      declarations: [LandingComponent]
    }).compileComponents();

    mockEnvService.GetEnvName.and.returnValue("local");

    fixture = TestBed.createComponent(LandingComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    const data = {
      data: { token: "sometoken", urls: { authBaseUrl: "someAuthBaseUrl", incontactBaseUrl: "incontactBaseUrl" } }
    };
    const messageEvent = jasmine.createSpyObj("window", ["message"]);
    const fromEvent = realFromEvent(window, "message");

    fixture.detectChanges();

    expect(component).toBeTruthy();

    fromEvent.subscribe(event => {
      expect(event).not.toBeNull();
      expect(messageEvent.message).toHaveBeenCalled();
    });
  });

  it('should create when load is true', () => {
    component.loaded = true;
    const messageEvent = jasmine.createSpyObj("window", ["message"]);
    const fromEvent = realFromEvent(window, "message");
    fixture.detectChanges();
    expect(component).toBeTruthy();

    fromEvent.subscribe(event => {
      expect(event).not.toBeNull();
      expect(messageEvent.message).toHaveBeenCalled();
    });
  });



});
