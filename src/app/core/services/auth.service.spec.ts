// TODO: Improve and use TestBed
import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { HttpClientModule } from "@angular/common/http";
import {Observable, of, timer} from 'rxjs';
import { AuthService } from "../services/auth.service";
import { AcdService } from "../services-http/acd.service";
import { TokenService } from "../services/token.service";
import { WhoAmIModel } from "../interfaces/whoAmI.model";
import { AcdToken } from "../interfaces/acd-token.model";
import { AuthInitial } from "../interfaces/auth-initial.model";
import { UserContext } from "../interfaces/user-context.model";
import { Platform } from "../constants/platform.constants";
import { CxOneService } from "../services-http/cxone.service";
import { CxoneToken } from "../interfaces/cxone-token.model";
import {TestScheduler} from 'rxjs/testing';

describe("AuthService", () => {
  let service: AuthService;

  let mockTokenService;
  let mockRouter;
  let mockAcdService;
  let mockCxOneService;

  const acdToken: AcdToken = {
    access_token: "validToken",
    act: null,
    agent_id: "",
    basic_header: "",
    bus_no: 100,
    expires_in: 0,
    refresh_token: "refreshToken",
    refresh_token_server_uri: "",
    resource_server_base_uri: "",
    scope: "",
    sub: "user: 1087",
    team_id: 0,
    token_type: "",
    iss: ""
  };

  const cxoneToken: CxoneToken = {
    accessToken: "validToken",
    accessTokenExpiry: 0,
    refreshToken: "refreshToken",
    basic_header: "",
    sub: "user: 1087",
    act: null,
    iss: ""
  };

  const authInitial: AuthInitial = {
    baseUri: "someUrl",
    apiBaseUri: "someApiUrl",
    authorizationBaseUri: "someAuthorizationBaseUri",
    platform: "acd",
    token: "someValidToken"
  };

  const whoIAm: WhoAmIModel = {
    agent_id: 1,
    team_id: 1,
    bus_no: 100,
    resource_server_base_uri: "someBaseUri",
    refresh_token_server_uri: "someTokenServerUri",
    expires_in: 10000,
    iss: "",
    sub: ""
  };

  const context: UserContext = {
    platform: "acd",
    baseUri: "someBaseUrl",
    apiBaseUri: "someApiUrl",
    authorizationBaseUri: "someAuthorizationBaseUri",
    refreshBaseUri: "someRefreshBaseUrl",
    refreshToken: "asd123",
    accessToken: "123123asdasd123123asdasd",
    expiresAt: 1000
  };

  const contextCXOne: UserContext = {
    platform: "cxone",
    baseUri: "someBaseUrl",
    apiBaseUri: "someApiUrl",
    authorizationBaseUri: "someAuthorizationBaseUri",
    refreshBaseUri: "someRefreshBaseUrl",
    refreshToken: "asd123",
    accessToken: "123123asdasd123123asdasd",
    expiresAt: 1000
  };

  const contextProfile: UserContext = context;
  const contextProfileCXOne: UserContext = contextCXOne;

  const defaultUser = {
    id: 1,
    externalUserId: "1",
    firstName: "Juan",
    lastName: "Perez",
    email: "juan.perez@email.com",
    title: "Ing",
    ext: 12545,
    personalNumber: "26546545642",
    businessUnitId: 1,
    allowWebAccess: true,
    userType: "agent",
    userStatus: "active",
    notificationType: "email-only",
    fullNam: "Juan Perez",
    timeZone: "Mountain"
  };

  beforeEach(() => {
    mockTokenService = jasmine.createSpyObj([
      "platform",
      "saveAcdNaiaToken",
      "saveCxOneNaiaToken",
      "getServerTime",
      "isTokenExpired",
      "updateContext",
      "setPlatform",
      "setImpersonationSessionInfo",
      "refreshToken",
      "destroySessionStorage"
    ]);
    mockRouter = jasmine.createSpyObj(["navigate"]);
    mockAcdService = jasmine.createSpyObj(["tokenExchange", "whoAmI"]);
    mockCxOneService = jasmine.createSpyObj(["tokenExchange", "getPermissions"]);

    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: AcdService, useValue: mockAcdService },
        { provide: CxOneService, useValue: mockCxOneService },
        { provide: TokenService, useValue: mockTokenService }
      ]
    });

    service = new AuthService(
      mockTokenService,
      mockRouter,
      mockAcdService,
      mockCxOneService
    );
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should call isLoggedIn to get isAuthenticated value", () => {
    service.isLoggedIn.subscribe((isAuthenticated: boolean) => {
      expect(isAuthenticated).toBe(false);
    });
  });

  it("should call whoAmI to get WhoAmIModel from central", () => {
    mockAcdService.whoAmI.and.returnValue(of(whoIAm));

    service.whoAmI("someURL", "someToken").subscribe((response: WhoAmIModel) => {
      expect(response).not.toBeUndefined();
      expect(response).not.toBeNull();
      expect(response).toEqual(whoIAm);
      expect(response.bus_no).toEqual(100);
      expect(response.resource_server_base_uri).toEqual("someBaseUri");
      expect(response.refresh_token_server_uri).toEqual("someTokenServerUri");
    });
  });

  it("should call tokenExchange to get AcdToken", () => {
    mockAcdService.tokenExchange.and.returnValue(of(acdToken));

    service.tokenExchange("someURL", "token", Platform.acd).subscribe((response: AcdToken) => {
      expect(response).not.toBeUndefined();
      expect(response).not.toBeNull();
      expect(response).toEqual(acdToken);
      expect(response.access_token).toEqual("validToken");
      expect(response.refresh_token).toEqual("refreshToken");
      expect(response.sub).toEqual("user: 1087");
    });
  });

  it("should call tokenExchange to get CxoneToken", () => {
    mockCxOneService.tokenExchange.and.returnValue(of(cxoneToken));

    service.tokenExchange("someURL", "token", Platform.cxOne).subscribe((response: CxoneToken) => {
      expect(response).not.toBeUndefined();
      expect(response).not.toBeNull();
      expect(response).toEqual(cxoneToken);
      expect(response.accessToken).toEqual("validToken");
      expect(response.refreshToken).toEqual("refreshToken");
      expect(response.sub).toEqual("user: 1087");
    });
  });

  it("should call completeAuthentication when AuthInitial is valid to populate Auth successful", () => {
    mockTokenService.platform = Platform.acd;
    mockAcdService.whoAmI.and.returnValue(of(whoIAm));
    mockAcdService.tokenExchange.and.returnValue(of(acdToken));
    mockTokenService.saveAcdNaiaToken.and.returnValue(contextProfile);
    mockTokenService.getServerTime.and.returnValue(of("2019-11-18T21:14:59.0345433Z"));
    mockTokenService.isTokenExpired.and.returnValue(false);
    mockTokenService.refreshToken.and.returnValue(of(acdToken));
    mockTokenService.updateContext.and.returnValue(of(context));

    expect(service.Context).toBeUndefined();
    service.completeAuthentication(authInitial);
    expect(service.Context).not.toBeUndefined();
    expect(service.Context).not.toBeNull();
    expect(service.Context.platform).toEqual("acd");
    expect(service.Context.apiBaseUri).toEqual("someApiUrl");
    expect(service.Context.accessToken).toEqual("123123asdasd123123asdasd");
  });

  it("should call populateAuth when is not manual authentication to populate Auth successfully", () => {
    mockTokenService.platform = Platform.acd;
    mockAcdService.whoAmI.and.returnValue(of(whoIAm));
    mockAcdService.tokenExchange.and.returnValue(of(acdToken));
    mockTokenService.saveAcdNaiaToken.and.returnValue(contextProfile);
    mockTokenService.getServerTime.and.returnValue(of("2019-11-18T21:14:59.0345433Z"));
    mockTokenService.isTokenExpired.and.returnValue(false);
    mockTokenService.refreshToken.and.returnValue(of(acdToken));
    mockTokenService.updateContext.and.returnValue(of(context));

    expect(service.Context).toBeUndefined();

    service.populateAuth(false, "someToken");

    expect(service.Context).not.toBeUndefined();
    expect(service.Context).not.toBeNull();
    expect(service.Context.platform).toEqual("acd");
    expect(service.Context.apiBaseUri).toEqual("someApiUrl");
  });

  it("should call populateAuth when is not manual authentication to populate Auth successfully for cxone platform", () => {
    mockTokenService.platform = Platform.cxOne;
    mockAcdService.whoAmI.and.returnValue(of(whoIAm));
    mockCxOneService.tokenExchange.and.returnValue(of(cxoneToken));
    mockTokenService.saveCxOneNaiaToken.and.returnValue(contextProfileCXOne);
    mockTokenService.getServerTime.and.returnValue(of("2019-11-18T21:14:59.0345433Z"));
    mockTokenService.isTokenExpired.and.returnValue(false);
    mockTokenService.refreshToken.and.returnValue(of(cxoneToken));
    mockTokenService.updateContext.and.returnValue(of(contextCXOne));

    expect(service.Context).toBeUndefined();

    service.populateAuth(false, "someToken");

    expect(service.Context).not.toBeUndefined();
    expect(service.Context).not.toBeNull();
    expect(service.Context.platform).toEqual("cxone");
    expect(service.Context.apiBaseUri).toEqual("someApiUrl");
  });

  it("should call cleanAuth when usercontext not valid and throw error in populateAuth", () => {
    mockTokenService.platform = Platform.acd;
    mockAcdService.whoAmI.and.returnValue(of(whoIAm));
    mockAcdService.tokenExchange.and.returnValue(of(acdToken));
    mockTokenService.saveAcdNaiaToken.and.returnValue();

    service.populateAuth();

    service.isAuthenticated.subscribe((isAuth: boolean) => {
      expect(isAuth).toBe(false);
      expect(service.Context).toBeNull();
    });
  });

  it("should clean Auth when platform is not defined", () => {
    mockTokenService.platform = null;

    service.populateAuth();

    service.isAuthenticated.subscribe((isAuth: boolean) => {
      expect(isAuth).toBe(false);
      expect(service.Context).toBeNull();
    });
  });

  it("should call cleanAuth when refreshToken returns null and throw error in populateAuth", () => {
    mockTokenService.platform = Platform.acd;
    mockAcdService.whoAmI.and.returnValue(of(whoIAm));
    mockAcdService.tokenExchange.and.returnValue(of(acdToken));
    mockTokenService.saveAcdNaiaToken.and.returnValue(contextProfile);
    mockTokenService.getServerTime.and.returnValue(of("2019-11-18T21:14:59.0345433Z"));
    mockTokenService.isTokenExpired.and.returnValue(true);
    mockTokenService.refreshToken.and.returnValue(of(null));

    service.populateAuth();
    expect(service.Context).not.toBeNull();
  });

  it("should call cleanAuth when platform is invalid to throw error in populateAuth", () => {

    service.populateAuth();

    service.isAuthenticated.subscribe((isAuth: boolean) => {
      expect(isAuth).toBe(false);
      expect(service.Context).toBeNull();
    });
  });

  it("should start timer token expiration when auth population is called successfully", (done) => {
    mockTokenService.platform = Platform.acd;
    mockAcdService.whoAmI.and.returnValue(of(whoIAm));
    mockAcdService.tokenExchange.and.returnValue(of(acdToken));
    mockTokenService.saveAcdNaiaToken.and.returnValue(contextProfile);
    mockTokenService.getServerTime.and.returnValue(of("2019-11-18T21:14:59.0345433Z"));
    mockTokenService.isTokenExpired.and.returnValue(false);
    mockTokenService.refreshToken.and.returnValue(of(acdToken));
    mockTokenService.updateContext.and.returnValue(of(context));

    expect(service.Context).toBeUndefined();

    service.populateAuth(false, "someToken");

    service.isAuthenticated.subscribe((isAuth: boolean) => {
      service.timeoutTimer.subscribe((value) => {
        done();
      });
    });
    expect(service.Context).not.toBeUndefined();
    expect(service.Context).not.toBeNull();
    expect(service.Context.platform).toEqual("acd");
    expect(service.Context.apiBaseUri).toEqual("someApiUrl");
  });
  it("should start timer token expiration when auth population is called successfully for cxone", (done) => {
    mockTokenService.platform = Platform.cxOne;
    mockAcdService.whoAmI.and.returnValue(of(whoIAm));
    mockAcdService.tokenExchange.and.returnValue(of(cxoneToken));
    mockTokenService.saveCxOneNaiaToken.and.returnValue(contextProfileCXOne);
    mockTokenService.getServerTime.and.returnValue(of("2019-11-18T21:14:59.0345433Z"));
    mockTokenService.isTokenExpired.and.returnValue(false);
    mockTokenService.refreshToken.and.returnValue(of(cxoneToken));
    mockTokenService.updateContext.and.returnValue(of(contextCXOne));

    expect(service.Context).toBeUndefined();

    service.populateAuth(false, "someToken");

    service.isAuthenticated.subscribe((isAuth: boolean) => {
      service.timeoutTimer.subscribe((value) => {
        done();
      });
    });
    expect(service.Context).not.toBeUndefined();
    expect(service.Context).not.toBeNull();
    expect(service.Context.platform).toEqual("cxone");
    expect(service.Context.apiBaseUri).toEqual("someApiUrl");
  });
  it("should unsubscribe all timers on destroy", () => {
    mockTokenService.platform = Platform.acd;
    mockAcdService.whoAmI.and.returnValue(of(whoIAm));
    mockAcdService.tokenExchange.and.returnValue(of(acdToken));
    mockTokenService.saveAcdNaiaToken.and.returnValue(contextProfile);
    mockTokenService.getServerTime.and.returnValue(of("2019-11-18T21:14:59.0345433Z"));
    mockTokenService.isTokenExpired.and.returnValue(false);
    mockTokenService.refreshToken.and.returnValue(of(acdToken));
    mockTokenService.updateContext.and.returnValue(of(context));

    expect(service.Context).toBeUndefined();

    service.populateAuth(false, "someToken");
    service.ngOnDestroy();
    expect(service.subscriptions.closed).toBeTrue();
  });
});
