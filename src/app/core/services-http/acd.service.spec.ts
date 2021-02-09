import { TestBed } from "@angular/core/testing";

import { AcdService } from "../services-http/acd.service";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { HttpClientModule } from "@angular/common/http";
import { AcdToken } from "../interfaces/acd-token.model";
import { ApiAbsoluteService } from "../services-http/api.absolute.service";
import { WhoAmIModel } from "../interfaces/whoAmI.model";

describe("AcdService", () => {
  let service: AcdService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [AcdService, ApiAbsoluteService]
    });
    service = TestBed.inject(AcdService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should call WhoAmI API", async () => {
    const token =
      // tslint:disable-next-line: max-line-length
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpY0JVSWQiOjUwLCJuYW1lIjoiamVzdXMubnVuZXpAaGMyLmNvbSIsImlzcyI6Imh0dHBzOi8vYXBpLmluY29udGFjdC5jb20iLCJzdWIiOiJ1c2VyOjI5ODkiLCJhdWQiOiJpbkNvbnRhY3QgQWRtaW5AaW5Db250YWN0IEluYy4iLCJleHAiOjE1NzM1MDQzNjcsImlhdCI6MTU3MzUwMDc2OCwiaWNTY29wZSI6IjEsMiw0LDgiLCJpY0NsdXN0ZXJJZCI6IkhDLUMyV0VCMDEiLCJpY0FnZW50SWQiOjI5ODksImljU1BJZCI6MTAwMzUsIm5iZiI6MTU3MzUwMDc2N30.hG-jntXqE6jAyrR3kp3XFeizcpb2RCxqE2fog6BGTdqn-uYsAKFfoXq1eUKxLVX_lszA8qmtAhXNowmAqtB_z0_pc0vK5Q1BqngoB5GZQoYQSR6Susan323MjpFyDIcny8ge6V34_LcadkP2NuTE032iCb59j2PgKH51DHZu3bDGzCVLjsDdrg3_uGxnEd9OdRYbLmiq94F68Aq29q5bgOVm62eYhCWCEp4nRO48t_ImCTz0N-m3U9N7TZ-bCzj1lPVSvYIDkr8suE3s2gp0g7E69vpoj_Vv0bVV3xAW_3CZkrGepaX-bAlHZSDTQ5XM_PMhOQivZc2KblW17Ki4Kg";
    service.whoAmI("http://localhost/InContactAuthorizationServer/", token).subscribe((data: WhoAmIModel) => {
      expect(data.resource_server_base_uri).toBe("http://hc-c2web01/InContactAPI/");
      expect(data.refresh_token_server_uri).toBe("http://hc-c2web01/InContactAuthorizationServer/Token");
      expect(data.iss).toBe("https://api.incontact.com");
      expect(data.sub).toBe("user:2989");
      expect(data.team_id).toBe(1787);
      expect(data.bus_no).toBe(50);
    });

    const response = {
      agent_id: 2989,
      team_id: 1787,
      bus_no: 50,
      resource_server_base_uri: "http://hc-c2web01/InContactAPI/",
      refresh_token_server_uri: "http://hc-c2web01/InContactAuthorizationServer/Token",
      expires_in: 3294,
      iss: "https://api.incontact.com",
      sub: "user:2989"
    };
    httpMock.expectOne("http://localhost/InContactAuthorizationServer/Token/WhoAmI").flush(response);
  });

  it("should call Token Exchange API ", async () => {
    const token =
      // tslint:disable-next-line: max-line-length
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpY0JVSWQiOjUwLCJuYW1lIjoiamVzdXMubnVuZXpAaGMyLmNvbSIsImlzcyI6Imh0dHBzOi8vYXBpLmluY29udGFjdC5jb20iLCJzdWIiOiJ1c2VyOjI5ODkiLCJhdWQiOiJpbkNvbnRhY3QgQWRtaW5AaW5Db250YWN0IEluYy4iLCJleHAiOjE1NzM1MDQzNjcsImlhdCI6MTU3MzUwMDc2OCwiaWNTY29wZSI6IjEsMiw0LDgiLCJpY0NsdXN0ZXJJZCI6IkhDLUMyV0VCMDEiLCJpY0FnZW50SWQiOjI5ODksImljU1BJZCI6MTAwMzUsIm5iZiI6MTU3MzUwMDc2N30.hG-jntXqE6jAyrR3kp3XFeizcpb2RCxqE2fog6BGTdqn-uYsAKFfoXq1eUKxLVX_lszA8qmtAhXNowmAqtB_z0_pc0vK5Q1BqngoB5GZQoYQSR6Susan323MjpFyDIcny8ge6V34_LcadkP2NuTE032iCb59j2PgKH51DHZu3bDGzCVLjsDdrg3_uGxnEd9OdRYbLmiq94F68Aq29q5bgOVm62eYhCWCEp4nRO48t_ImCTz0N-m3U9N7TZ-bCzj1lPVSvYIDkr8suE3s2gp0g7E69vpoj_Vv0bVV3xAW_3CZkrGepaX-bAlHZSDTQ5XM_PMhOQivZc2KblW17Ki4Kg";
    service.tokenExchange("http://localhost/InContactAuthorizationServer/", token).subscribe((data: AcdToken) => {
      expect(data.access_token).toBe(
        // tslint:disable-next-line: max-line-length
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpY0JVSWQiOjUwLCJuYW1lIjoiamVzdXMubnVuZXpAaGMyLmNvbSIsImlzcyI6Imh0dHBzOi8vYXBpLmluY29udGFjdC5jb20iLCJzdWIiOiJ1c2VyOjI5ODkiLCJhdWQiOiJpbkNvbnRhY3QgQXV0byBBdHRlbmRhbnRAaW5Db250YWN0IEluYy4iLCJleHAiOjE1NzM1MDYzMjcsImlhdCI6MTU3MzUwMjcyNywiaWNTY29wZSI6IjEsMiw0LDgiLCJpY0NsdXN0ZXJJZCI6IkhDLUMyV0VCMDEiLCJpY0FnZW50SWQiOjI5ODksImljU1BJZCI6MTAwMzUsIm5iZiI6MTU3MzUwMjcyN30.XzvPyBjvtbFP-L0ttDmysMACuhWa6E_tX9YwO9S6uJEJRhKfBdu5SbDNfSfTPHrUIqTuQ8brYygLUc76qxOUSPMDP3T-g3suDnhvi0Smt_K_gk5K2_9jsLUa_YrrJqagPGldC644nnMQCRwTG6WE_T8JSaNPrej44iO_yFWOXeAh_9UrvrZ-r5BoOIIrnIG1IB2gbhjuAfsuuXfhpzVpsEolP0DPgPPu3CX-mGT7FGaaoDxXSXIapBlEmLJnLNmoH9cSliDs3DbuieT1Y5vo97aObOGNu8jRjsBNOToptngCUY-WyBssCF1VhOLnwUhp88p_qHA2LHZxQZkbJ3gJ8A"
      );
      expect(data.token_type).toBe("bearer");
      expect(data.expires_in).toEqual(3600);
      expect(data.refresh_token).toBe("2xqEBebyTk21hapKBFI8yg==");
      expect(data.scope).toBe("RealTimeApi AdminApi AgentApi ReportingApi");
      expect(data.resource_server_base_uri).toBe("http://hc-c2web01/InContactAPI/");
      expect(data.refresh_token_server_uri).toBe("http://hc-c2web01/InContactAuthorizationServer/Token");
      expect(data.team_id).toEqual(1787);
      expect(data.bus_no).toEqual(50);
    });

    const response = {
      access_token:
        // tslint:disable-next-line: max-line-length
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpY0JVSWQiOjUwLCJuYW1lIjoiamVzdXMubnVuZXpAaGMyLmNvbSIsImlzcyI6Imh0dHBzOi8vYXBpLmluY29udGFjdC5jb20iLCJzdWIiOiJ1c2VyOjI5ODkiLCJhdWQiOiJpbkNvbnRhY3QgQXV0byBBdHRlbmRhbnRAaW5Db250YWN0IEluYy4iLCJleHAiOjE1NzM1MDYzMjcsImlhdCI6MTU3MzUwMjcyNywiaWNTY29wZSI6IjEsMiw0LDgiLCJpY0NsdXN0ZXJJZCI6IkhDLUMyV0VCMDEiLCJpY0FnZW50SWQiOjI5ODksImljU1BJZCI6MTAwMzUsIm5iZiI6MTU3MzUwMjcyN30.XzvPyBjvtbFP-L0ttDmysMACuhWa6E_tX9YwO9S6uJEJRhKfBdu5SbDNfSfTPHrUIqTuQ8brYygLUc76qxOUSPMDP3T-g3suDnhvi0Smt_K_gk5K2_9jsLUa_YrrJqagPGldC644nnMQCRwTG6WE_T8JSaNPrej44iO_yFWOXeAh_9UrvrZ-r5BoOIIrnIG1IB2gbhjuAfsuuXfhpzVpsEolP0DPgPPu3CX-mGT7FGaaoDxXSXIapBlEmLJnLNmoH9cSliDs3DbuieT1Y5vo97aObOGNu8jRjsBNOToptngCUY-WyBssCF1VhOLnwUhp88p_qHA2LHZxQZkbJ3gJ8A",
      token_type: "bearer",
      expires_in: 3600,
      refresh_token: "2xqEBebyTk21hapKBFI8yg==",
      scope: "RealTimeApi AdminApi AgentApi ReportingApi",
      resource_server_base_uri: "http://hc-c2web01/InContactAPI/",
      refresh_token_server_uri: "http://hc-c2web01/InContactAuthorizationServer/Token",
      agent_id: 2989,
      team_id: 1787,
      bus_no: 50
    };
    httpMock.expectOne("http://localhost/InContactAuthorizationServer/Token").flush(response);
  });

  it("should call Token Refresh API ", async () => {
    const refreshToken = "hZYD8dgdpEyapboZPn4g8Q==";
    service.refreshToken("http://localhost/InContactAuthorizationServer/", refreshToken).subscribe((data: AcdToken) => {
      expect(data.access_token).toBe(
        // tslint:disable-next-line: max-line-length
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpY0JVSWQiOjUwLCJuYW1lIjoiamVzdXMubnVuZXpAaGMyLmNvbSIsImlzcyI6Imh0dHBzOi8vYXBpLmluY29udGFjdC5jb20iLCJzdWIiOiJ1c2VyOjI5ODkiLCJhdWQiOiJpbkNvbnRhY3QgQXV0byBBdHRlbmRhbnRAaW5Db250YWN0IEluYy4iLCJleHAiOjE1NzQwODU5MDMsImlhdCI6MTU3NDA4MjMwNCwiaWNTY29wZSI6IjEsMiw0LDgiLCJpY0NsdXN0ZXJJZCI6IkhDLUMyV0VCMDEiLCJpY0FnZW50SWQiOjI5ODksImljU1BJZCI6MTAwMzUsIm5iZiI6MTU3NDA4MjMwM30.GvSGGJs2Ro47YlgDj1rFXWOuQ4XiLD5g_y3MsgaClPRP6UWXHAOc1Z3BoabgHpTDTe20xXCvBtW9m11n34rj8I28f5L7R1SdP5Il8mKo8ZZYyFlTvi1ed6WrV7ApDA42N_VvnWP2kBHz7XzP0TUTp4yP53f-3iVhPSAsQ8eaCq0uweStT52q8oj-MMaN8ni-uKfAoUn_Y4A7CqPF8Xt2EYeZMkG_bGvgWOZ5r92JysKpmYH5HyaDkWIqdmEOB2th2Rkpksb7Xtqcb0TrHcqhb7OhhnJNwaeOfmqr9wBLRF2dls8R7UpVl9Kf_t-H2aizzV_O6-OoGbPX-BeqLjX7Zg"
      );
      expect(data.token_type).toBe("bearer");
      expect(data.expires_in).toEqual(3600);
      expect(data.refresh_token).toBe("OhwgmBE7Z0Wh2wgytahQUg==");
      expect(data.scope).toBe("RealTimeApi AdminApi AgentApi ReportingApi");
      expect(data.resource_server_base_uri).toBe("http://hc-c2web01/InContactAPI/");
      expect(data.refresh_token_server_uri).toBe("http://hc-c2web01/InContactAuthorizationServer/Token");
      expect(data.team_id).toEqual(1787);
      expect(data.bus_no).toEqual(50);
    });

    const response = {
      access_token:
        // tslint:disable-next-line: max-line-length
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpY0JVSWQiOjUwLCJuYW1lIjoiamVzdXMubnVuZXpAaGMyLmNvbSIsImlzcyI6Imh0dHBzOi8vYXBpLmluY29udGFjdC5jb20iLCJzdWIiOiJ1c2VyOjI5ODkiLCJhdWQiOiJpbkNvbnRhY3QgQXV0byBBdHRlbmRhbnRAaW5Db250YWN0IEluYy4iLCJleHAiOjE1NzQwODU5MDMsImlhdCI6MTU3NDA4MjMwNCwiaWNTY29wZSI6IjEsMiw0LDgiLCJpY0NsdXN0ZXJJZCI6IkhDLUMyV0VCMDEiLCJpY0FnZW50SWQiOjI5ODksImljU1BJZCI6MTAwMzUsIm5iZiI6MTU3NDA4MjMwM30.GvSGGJs2Ro47YlgDj1rFXWOuQ4XiLD5g_y3MsgaClPRP6UWXHAOc1Z3BoabgHpTDTe20xXCvBtW9m11n34rj8I28f5L7R1SdP5Il8mKo8ZZYyFlTvi1ed6WrV7ApDA42N_VvnWP2kBHz7XzP0TUTp4yP53f-3iVhPSAsQ8eaCq0uweStT52q8oj-MMaN8ni-uKfAoUn_Y4A7CqPF8Xt2EYeZMkG_bGvgWOZ5r92JysKpmYH5HyaDkWIqdmEOB2th2Rkpksb7Xtqcb0TrHcqhb7OhhnJNwaeOfmqr9wBLRF2dls8R7UpVl9Kf_t-H2aizzV_O6-OoGbPX-BeqLjX7Zg",
      token_type: "bearer",
      expires_in: 3600,
      refresh_token: "OhwgmBE7Z0Wh2wgytahQUg==",
      scope: "RealTimeApi AdminApi AgentApi ReportingApi",
      resource_server_base_uri: "http://hc-c2web01/InContactAPI/",
      refresh_token_server_uri: "http://hc-c2web01/InContactAuthorizationServer/Token",
      agent_id: 2989,
      team_id: 1787,
      bus_no: 50
    };
    httpMock.expectOne("http://localhost/InContactAuthorizationServer/Token").flush(response);
  });

  it("should call get server time API", async () => {
    service.getServerTime("http://localhost/InContactAPI/").subscribe((data: string) => {
      expect(data).toBe("2019-11-18T21:14:59.0345433Z");
    });

    const response = {
      ServerTime: "2019-11-18T21:14:59.0345433Z"
    };

    httpMock.expectOne("http://localhost/InContactAPI/services/v3.0/server-time").flush(response);
  });
});
