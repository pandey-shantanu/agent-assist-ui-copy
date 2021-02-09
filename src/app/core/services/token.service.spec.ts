import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { HttpClientModule } from "@angular/common/http";
import { TokenService } from "../services/token.service";
import { TokenClaims } from "../constants/token-claims.constants";
import { ApiAbsoluteService } from "../services-http/api.absolute.service";
import { AcdService } from "../services-http/acd.service";
import { UserContext } from "../interfaces/user-context.model";
import { AcdToken } from "../interfaces/acd-token.model";
import { of } from "rxjs";
import { Platform } from "../constants/platform.constants";
import { CxOneService } from "../services-http/cxone.service";
import { CxoneToken } from "../interfaces/cxone-token.model";

describe("TokenService", () => {
  let service: TokenService;
  let mockAcdService;
  let mockCxOneService;

  beforeEach(() => {
    mockAcdService = jasmine.createSpyObj(["refreshToken", "getServerTime"]);
    mockCxOneService = jasmine.createSpyObj(["refreshToken"]);

    let store = {};

    spyOn(localStorage, "getItem").and.callFake((key: string): string => {
      return store[key] || null;
    });
    spyOn(localStorage, "removeItem").and.callFake((key: string): void => {
      delete store[key];
    });
    spyOn(localStorage, "setItem").and.callFake((key: string, value: string): string => {
      return (store[key] = value as string);
    });
    spyOn(localStorage, "clear").and.callFake(() => {
      store = {};
    });

    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [
        { provide: AcdService, useValue: mockAcdService },
        { provide: CxOneService, useValue: mockCxOneService },
        ApiAbsoluteService
      ]
    });

    service = new TokenService(mockAcdService, mockCxOneService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should destroy local storage to clean memory", () => {
    service.destroySessionStorage();
    expect(localStorage.getItem(TokenClaims.accessToken)).toBeNull();
  });

  it("should validate if localstorage is present", () => {
    service.destroySessionStorage();
    service.setAccessToken("abcdefg");
    const res = service.sessionStoragePresent();
    expect(res).toBe(true);
  });

  it("should save AcdNaiaToken when token is valid", () => {
    const token =
      // tslint:disable-next-line: max-line-length
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpY0JVSWQiOjEwMCwibmFtZSI6ImFtZWRyYW5vQGRvNTkuY29tIiwiaXNzIjoiaHR0cHM6Ly9hcGktZG81OWRldi5uaWNlLWluY29udGFjdC5jb20iLCJzdWIiOiJ1c2VyOjEwODciLCJhdWQiOiJpbkNvbnRhY3QgQWRtaW5AaW5Db250YWN0IEluYy4iLCJleHAiOjE1NzUzODc2MDIsImlhdCI6MTU3NTM4NDAwMiwiaWNTY29wZSI6IjEsMiw0LDgiLCJpY0NsdXN0ZXJJZCI6IkRPNTkiLCJpY0FnZW50SWQiOjEwODcsImljU1BJZCI6NywibmJmIjoxNTc1Mzg0MDAyfQ.ZyX2KaeDt8maOc7q2OEFMqwqUgjtnLKpc6xGq9n7Wwpt0OBy-f4Os-CA_8GoVy23AmtNp8rNO6R6ouXSPr668aNIo9J7t4uew7Exzb9kTVvG17hz40ebMEk9m2PCjQwftHSwuH8K2AMClm5uoT_fkAPQ-oQnEo1bHlwy2P-V6xdfLr58dDyZD5Z48xVTNV1O9ETY9xXjiWgVvbkFjzDmAFKdD9bEmDtRMaEH0eLao6BBLxl0bXom6_8wX7TzfROsD4_PgU4DPLDCTky-TQj0OKmqhFjc0ipOyG-vxziogJbTMSTH7vl51MDo0doeDJtxumDPCiTAO7-hhuTzvwJNfw";
    const refreshToken = "asdasdasdasd";
    const acdToken: AcdToken = {
      access_token: token,
      act: null,
      agent_id: "",
      basic_header: "",
      bus_no: 100,
      expires_in: 0,
      refresh_token: refreshToken,
      refresh_token_server_uri: "",
      resource_server_base_uri: "",
      scope: "",
      sub: "user: 1087",
      team_id: 0,
      token_type: "",
      iss: ""
    };
    const initialContext: UserContext = {
      platform: "acd",
      baseUri: "someBaseUrl",
      apiBaseUri: "someApiUrl",
      authorizationBaseUri: "someAuthorizationBaseUrl",
      refreshBaseUri: "someRefreshBaseUrl",
      refreshToken: "asd123",
      accessToken: token,
      expiresAt: 1000
    };
    const context: UserContext = service.saveAcdNaiaToken(initialContext, acdToken);

    expect(context.accessToken).toEqual(token);
    expect(context.refreshToken).toEqual(refreshToken);
    expect(service.platform).toEqual("acd");
  });

  it("should save CxOneNaiaToken when token is valid", () => {
    const token =
      // tslint:disable-next-line: max-line-length
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpY0JVSWQiOjEwMCwibmFtZSI6ImFtZWRyYW5vQGRvNTkuY29tIiwiaXNzIjoiaHR0cHM6Ly9hcGktZG81OWRldi5uaWNlLWluY29udGFjdC5jb20iLCJzdWIiOiJ1c2VyOjEwODciLCJhdWQiOiJpbkNvbnRhY3QgQWRtaW5AaW5Db250YWN0IEluYy4iLCJleHAiOjE1NzUzODc2MDIsImlhdCI6MTU3NTM4NDAwMiwiaWNTY29wZSI6IjEsMiw0LDgiLCJpY0NsdXN0ZXJJZCI6IkRPNTkiLCJpY0FnZW50SWQiOjEwODcsImljU1BJZCI6NywibmJmIjoxNTc1Mzg0MDAyfQ.ZyX2KaeDt8maOc7q2OEFMqwqUgjtnLKpc6xGq9n7Wwpt0OBy-f4Os-CA_8GoVy23AmtNp8rNO6R6ouXSPr668aNIo9J7t4uew7Exzb9kTVvG17hz40ebMEk9m2PCjQwftHSwuH8K2AMClm5uoT_fkAPQ-oQnEo1bHlwy2P-V6xdfLr58dDyZD5Z48xVTNV1O9ETY9xXjiWgVvbkFjzDmAFKdD9bEmDtRMaEH0eLao6BBLxl0bXom6_8wX7TzfROsD4_PgU4DPLDCTky-TQj0OKmqhFjc0ipOyG-vxziogJbTMSTH7vl51MDo0doeDJtxumDPCiTAO7-hhuTzvwJNfw";
    const refreshToken = "asdasdasdasd";
    const cxoneToken: CxoneToken = {
      accessToken: token,
      accessTokenExpiry: 0,
      refreshToken,
      basic_header: "",
      sub: "user: 1087",
      act: null,
      iss: ""
    };
    const initialContext: UserContext = {
      platform: Platform.cxOne,
      baseUri: "someBaseUrl",
      apiBaseUri: "someApiUrl",
      authorizationBaseUri: "someAuthorizationBaseUrl",
      refreshBaseUri: "someRefreshBaseUrl",
      refreshToken: "asd123",
      accessToken: token,
      expiresAt: 1000
    };
    const context = service.saveCxOneNaiaToken(initialContext, cxoneToken);

    expect(context.accessToken).toEqual(token);
    expect(context.refreshToken).toEqual(refreshToken);
    expect(service.platform).toEqual(Platform.cxOne);
  });

  it("should update local storage and return a context when token is valid", () => {
    const token =
      // tslint:disable-next-line: max-line-length
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpY0JVSWQiOjEwMCwibmFtZSI6ImFtZWRyYW5vQGRvNTkuY29tIiwiaXNzIjoiaHR0cHM6Ly9hcGktZG81OWRldi5uaWNlLWluY29udGFjdC5jb20iLCJzdWIiOiJ1c2VyOjEwODciLCJhdWQiOiJpbkNvbnRhY3QgQWRtaW5AaW5Db250YWN0IEluYy4iLCJleHAiOjE1NzUzODc2MDIsImlhdCI6MTU3NTM4NDAwMiwiaWNTY29wZSI6IjEsMiw0LDgiLCJpY0NsdXN0ZXJJZCI6IkRPNTkiLCJpY0FnZW50SWQiOjEwODcsImljU1BJZCI6NywibmJmIjoxNTc1Mzg0MDAyfQ.ZyX2KaeDt8maOc7q2OEFMqwqUgjtnLKpc6xGq9n7Wwpt0OBy-f4Os-CA_8GoVy23AmtNp8rNO6R6ouXSPr668aNIo9J7t4uew7Exzb9kTVvG17hz40ebMEk9m2PCjQwftHSwuH8K2AMClm5uoT_fkAPQ-oQnEo1bHlwy2P-V6xdfLr58dDyZD5Z48xVTNV1O9ETY9xXjiWgVvbkFjzDmAFKdD9bEmDtRMaEH0eLao6BBLxl0bXom6_8wX7TzfROsD4_PgU4DPLDCTky-TQj0OKmqhFjc0ipOyG-vxziogJbTMSTH7vl51MDo0doeDJtxumDPCiTAO7-hhuTzvwJNfw";
    const context: UserContext = service.updateContext(
      token,
      "no_token",
      Platform.acd,
      "someurl",
      "someApiUrl",
      "someAuthorizationBaseUrl",
      "refreshUrl"
    );
    // expect(context.accessToken).toEqual(token);
    expect(context.refreshToken).toEqual("no_token");
    expect(context.platform).toEqual("acd");
    expect(context.baseUri).toEqual("someurl");
    expect(context.apiBaseUri).toEqual("someApiUrl");
    expect(context.refreshBaseUri).toEqual("refreshUrl");
    // expect(service.accessToken).toEqual(token);
    expect(service.platform).toEqual("acd");
  });

  it("should return false when acd token is not expired", () => {
    const token =
      // tslint:disable-next-line: max-line-length
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpY0JVSWQiOjEwMCwibmFtZSI6ImFtZWRyYW5vQGRvNTkuY29tIiwiaXNzIjoiaHR0cHM6Ly9hcGktZG81OWRldi5uaWNlLWluY29udGFjdC5jb20iLCJzdWIiOiJ1c2VyOjEwODciLCJhdWQiOiJpbkNvbnRhY3QgQWRtaW5AaW5Db250YWN0IEluYy4iLCJleHAiOjE1NzUzODc2MDIsImlhdCI6MTU3NTM4NDAwMiwiaWNTY29wZSI6IjEsMiw0LDgiLCJpY0NsdXN0ZXJJZCI6IkRPNTkiLCJpY0FnZW50SWQiOjEwODcsImljU1BJZCI6NywibmJmIjoxNTc1Mzg0MDAyfQ.ZyX2KaeDt8maOc7q2OEFMqwqUgjtnLKpc6xGq9n7Wwpt0OBy-f4Os-CA_8GoVy23AmtNp8rNO6R6ouXSPr668aNIo9J7t4uew7Exzb9kTVvG17hz40ebMEk9m2PCjQwftHSwuH8K2AMClm5uoT_fkAPQ-oQnEo1bHlwy2P-V6xdfLr58dDyZD5Z48xVTNV1O9ETY9xXjiWgVvbkFjzDmAFKdD9bEmDtRMaEH0eLao6BBLxl0bXom6_8wX7TzfROsD4_PgU4DPLDCTky-TQj0OKmqhFjc0ipOyG-vxziogJbTMSTH7vl51MDo0doeDJtxumDPCiTAO7-hhuTzvwJNfw";
    service.setAccessToken(token);
    const isTokenExpired = service.isTokenExpired("2019-11-18T21:14:59.0345433Z", Platform.acd);
    expect(isTokenExpired).toBe(false);
  });

  it("should return true when cxone token is expired", () => {
    const token =
      // tslint:disable-next-line: max-line-length
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJ1c2VyOjExZWFiY2FiLWRlYmQtNzg1MC05ZDIzLTAyNDJhYzExMDAwMyIsInJvbGUiOnsibGVnYWN5SWQiOiJBZG1pbmlzdHJhdG9yIiwic2Vjb25kYXJ5Um9sZXMiOltdLCJpZCI6IjExZTkxMDcxLTc2MzYtNzRlMC1hYTg1LTAyNDJhYzExMDAwMiIsImxhc3RVcGRhdGVUaW1lIjoxNTk2MDM0NTAzMDAwfSwiaWNBZ2VudElkIjoiNDI3OSIsImlzcyI6Imh0dHBzOlwvXC9hdXRoLmRldi5uaWNlLWluY29udGFjdC5jb20iLCJhdWQiOiJpbkNvbnRhY3QgRXZvbHZlQGluQ29udGFjdC5jb20iLCJpY1NQSWQiOiIxMDE5NCIsImljQlVJZCI6MTMzNzEzMzcsIm5hbWUiOiJhbnRvbmlvLnNjaGxhcHBhQGRvMzIuY29tIiwidGVuYW50SWQiOiIxMWU5MTA3MS03NDM2LWZiNjAtYTcxMy0wMjQyYWMxMTAwMGEiLCJleHAiOjE1OTc5NzMxODYsImlhdCI6MTU5Nzk2OTU4NiwidGVuYW50IjoicGVybV9qb2VkbzMyMjA2NTUwNDYiLCJ2aWV3cyI6e30sImljQ2x1c3RlcklkIjoiZG8zMiJ9.gwMNH69ivrVqUufh2evS3xY8NpGWYx6UfTy3GUw_QPj10yITfnuFxzdOsQiTLekJVmINNgW-x7YrR12upJ1FawLuh0-HwtcmIYlnjThM_ZLhUqOkmrzE-TNPZ81iajNCMZmOB9vGRsevK8P6ki7KcMSo4DERwfXiC0CRb8H-lW0";
    service.setAccessToken(token);
    const isTokenExpired = service.isTokenExpired("2019-11-18T21:14:59.0345433Z", Platform.cxOne);
    expect(isTokenExpired).toBe(true);
  });

  it("should refresh token when acdService.refreshToken is called", () => {
    const token =
      // tslint:disable-next-line: max-line-length
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpY0JVSWQiOjEwMCwibmFtZSI6ImFtZWRyYW5vQGRvNTkuY29tIiwiaXNzIjoiaHR0cHM6Ly9hcGktZG81OWRldi5uaWNlLWluY29udGFjdC5jb20iLCJzdWIiOiJ1c2VyOjEwODciLCJhdWQiOiJpbkNvbnRhY3QgQWRtaW5AaW5Db250YWN0IEluYy4iLCJleHAiOjE1NzUzODc2MDIsImlhdCI6MTU3NTM4NDAwMiwiaWNTY29wZSI6IjEsMiw0LDgiLCJpY0NsdXN0ZXJJZCI6IkRPNTkiLCJpY0FnZW50SWQiOjEwODcsImljU1BJZCI6NywibmJmIjoxNTc1Mzg0MDAyfQ.ZyX2KaeDt8maOc7q2OEFMqwqUgjtnLKpc6xGq9n7Wwpt0OBy-f4Os-CA_8GoVy23AmtNp8rNO6R6ouXSPr668aNIo9J7t4uew7Exzb9kTVvG17hz40ebMEk9m2PCjQwftHSwuH8K2AMClm5uoT_fkAPQ-oQnEo1bHlwy2P-V6xdfLr58dDyZD5Z48xVTNV1O9ETY9xXjiWgVvbkFjzDmAFKdD9bEmDtRMaEH0eLao6BBLxl0bXom6_8wX7TzfROsD4_PgU4DPLDCTky-TQj0OKmqhFjc0ipOyG-vxziogJbTMSTH7vl51MDo0doeDJtxumDPCiTAO7-hhuTzvwJNfw";
    const acdToken: AcdToken = {
      access_token: token,
      act: null,
      agent_id: "",
      basic_header: "",
      bus_no: 100,
      expires_in: 0,
      refresh_token: "hhuTzvwJNfw",
      refresh_token_server_uri: "",
      resource_server_base_uri: "",
      scope: "",
      sub: "user: 1087",
      team_id: 0,
      token_type: "",
      iss: ""
    };

    mockAcdService.refreshToken.and.returnValue(of(acdToken));

    service.refreshToken("someUrl", acdToken.refresh_token, Platform.acd).subscribe((acdTokenRefreshed: AcdToken) => {
      expect(acdTokenRefreshed).toEqual(acdToken);
    });
  });

  it("should refresh token when cxoneService.refreshToken is called", () => {
    const token =
      // tslint:disable-next-line: max-line-length
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJ1c2VyOjExZWFiY2FiLWRlYmQtNzg1MC05ZDIzLTAyNDJhYzExMDAwMyIsInJvbGUiOnsibGVnYWN5SWQiOiJBZG1pbmlzdHJhdG9yIiwic2Vjb25kYXJ5Um9sZXMiOltdLCJpZCI6IjExZTkxMDcxLTc2MzYtNzRlMC1hYTg1LTAyNDJhYzExMDAwMiIsImxhc3RVcGRhdGVUaW1lIjoxNTk2MDM0NTAzMDAwfSwiaWNBZ2VudElkIjoiNDI3OSIsImlzcyI6Imh0dHBzOlwvXC9hdXRoLmRldi5uaWNlLWluY29udGFjdC5jb20iLCJhdWQiOiJpbkNvbnRhY3QgRXZvbHZlQGluQ29udGFjdC5jb20iLCJpY1NQSWQiOiIxMDE5NCIsImljQlVJZCI6MTMzNzEzMzcsIm5hbWUiOiJhbnRvbmlvLnNjaGxhcHBhQGRvMzIuY29tIiwidGVuYW50SWQiOiIxMWU5MTA3MS03NDM2LWZiNjAtYTcxMy0wMjQyYWMxMTAwMGEiLCJleHAiOjE1OTc5NzMxODYsImlhdCI6MTU5Nzk2OTU4NiwidGVuYW50IjoicGVybV9qb2VkbzMyMjA2NTUwNDYiLCJ2aWV3cyI6e30sImljQ2x1c3RlcklkIjoiZG8zMiJ9.gwMNH69ivrVqUufh2evS3xY8NpGWYx6UfTy3GUw_QPj10yITfnuFxzdOsQiTLekJVmINNgW-x7YrR12upJ1FawLuh0-HwtcmIYlnjThM_ZLhUqOkmrzE-TNPZ81iajNCMZmOB9vGRsevK8P6ki7KcMSo4DERwfXiC0CRb8H-lW0";
    const cxoneToken: CxoneToken = {
      accessToken: token,
      accessTokenExpiry: 0,
      refreshToken: "hhuTzvwJNfw",
      basic_header: "",
      sub: "user: 1087",
      act: null,
      iss: ""
    };

    mockCxOneService.refreshToken.and.returnValue(of(cxoneToken));

    service
      .refreshToken("someUrl", cxoneToken.refreshToken, Platform.cxOne)
      .subscribe((cxoneTokenRefreshed: CxoneToken) => {
        expect(cxoneTokenRefreshed).toEqual(cxoneToken);
      });
  });

  it("should get server time when acdService.getServerTime is called", () => {
    const serverTime = "2019-12-03T12:12:12.0345433Z";

    mockAcdService.getServerTime.and.returnValue(of(serverTime));

    service.getServerTime("someUrl").subscribe((response: string) => {
      expect(response).toEqual(serverTime);
    });
  });

  it("should save the platform in the session storage", () => {
    service.setPlatform('value');
    const platform = service.platform;

    expect(platform).toBe('value');
  });
});
