import { TestBed } from "@angular/core/testing";

import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { HttpClientModule } from "@angular/common/http";
import { ApiAbsoluteService } from "../services-http/api.absolute.service";
import { CxOneService } from "./cxone.service";
import { CxoneToken } from "../interfaces/cxone-token.model";
import { CxoneRefreshTokenResponse } from "../interfaces/cxone-refresh-token-response.model";

describe("CxOneService", () => {
  let service: CxOneService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [CxOneService, ApiAbsoluteService]
    });
    service = TestBed.inject(CxOneService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should call Token Exchange API ", async () => {
    const token =
      // tslint:disable-next-line: max-line-length
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJ1c2VyOjExZWFiY2FiLWRlYmQtNzg1MC05ZDIzLTAyNDJhYzExMDAwMyIsInJvbGUiOnsibGVnYWN5SWQiOiJBZG1pbmlzdHJhdG9yIiwic2Vjb25kYXJ5Um9sZXMiOltdLCJpZCI6IjExZTkxMDcxLTc2MzYtNzRlMC1hYTg1LTAyNDJhYzExMDAwMiIsImxhc3RVcGRhdGVUaW1lIjoxNTk0MzM2ODgyMDAwfSwiaWNBZ2VudElkIjoiNDI3OSIsImlzcyI6Imh0dHBzOlwvXC9hdXRoLmRldi5uaWNlLWluY29udGFjdC5jb20iLCJhdWQiOiJpbkNvbnRhY3QgRXZvbHZlQGluQ29udGFjdC5jb20iLCJpY1NQSWQiOiIxMDE5NCIsImljQlVJZCI6MTMzNzEzMzcsIm5hbWUiOiJhbnRvbmlvLnNjaGxhcHBhQGRvMzIuY29tIiwidGVuYW50SWQiOiIxMWU5MTA3MS03NDM2LWZiNjAtYTcxMy0wMjQyYWMxMTAwMGEiLCJleHAiOjE1OTU3MjEwMTYsImlhdCI6MTU5NTcxNzQxNiwidGVuYW50IjoicGVybV9qb2VkbzMyMjA2NTUwNDYiLCJpY0NsdXN0ZXJJZCI6ImRvMzIifQ.KIi8j4HLbjUFThC4lXA8Djx97DVgCoX8YXMvOrd7eoWvI8ClqYPm_G2ze1by3J57mOf61Vvtdv1icPBbMlbHUPZ1IcNZNQK1WYt4mRDDDvXplRpXs_n2EtmVZYOmTtaDkkZX0VpnYiDQArT6Q_lloUIpBj_ZwxGb_SGdiHcJxiE";
    service.tokenExchange("http://localhost/", token).subscribe((data: CxoneToken) => {
      expect(data.accessToken).toBe(
        // tslint:disable-next-line: max-line-length
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJ1c2VyOjExZWFiY2FiLWRlYmQtNzg1MC05ZDIzLTAyNDJhYzExMDAwMyIsInJvbGUiOnsibGVnYWN5SWQiOiJBZG1pbmlzdHJhdG9yIiwic2Vjb25kYXJ5Um9sZXMiOltdLCJpZCI6IjExZTkxMDcxLTc2MzYtNzRlMC1hYTg1LTAyNDJhYzExMDAwMiIsImxhc3RVcGRhdGVUaW1lIjoxNTk0MzM2ODgyMDAwfSwiaWNBZ2VudElkIjoiNDI3OSIsImlzcyI6Imh0dHBzOi8vYXV0aC5kZXYubmljZS1pbmNvbnRhY3QuY29tIiwiYXVkIjoiaW5Db250YWN0IEF1dG8gQXR0ZW5kYW50QGluQ29udGFjdCBJbmMuIiwiaWNTUElkIjoiMTAxOTQiLCJpY0JVSWQiOjEzMzcxMzM3LCJuYW1lIjoiYW50b25pby5zY2hsYXBwYUBkbzMyLmNvbSIsInRlbmFudElkIjoiMTFlOTEwNzEtNzQzNi1mYjYwLWE3MTMtMDI0MmFjMTEwMDBhIiwiZXhwIjoxNTk1NzIxMDE2LCJpYXQiOjE1OTU3MTc0MTYsInRlbmFudCI6InBlcm1fam9lZG8zMjIwNjU1MDQ2IiwiaWNDbHVzdGVySWQiOiJkbzMyIn0.olv3xhrB5qyiGn2PLJerR3jOpFuQ-NZQ9ZVEyqyWcZwduIvAZie6vAA-pDDTeJRQfhsxF0iJOMWQ41PIc5WADekV9St0s504jQsTgHz9S-N5DIloiB5uOhfbV5LcBz_qwnHWRSNTpXAlLYQpTp7ROBSa8a60SyC3YkyoA-T6eF4"
      );
      expect(data.accessTokenExpiry).toEqual(3600);
      expect(data.refreshToken).toBe("2xqEBebyTk21hapKBFI8yg==");
    });

    const response = {
      accessToken:
        // tslint:disable-next-line: max-line-length
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJ1c2VyOjExZWFiY2FiLWRlYmQtNzg1MC05ZDIzLTAyNDJhYzExMDAwMyIsInJvbGUiOnsibGVnYWN5SWQiOiJBZG1pbmlzdHJhdG9yIiwic2Vjb25kYXJ5Um9sZXMiOltdLCJpZCI6IjExZTkxMDcxLTc2MzYtNzRlMC1hYTg1LTAyNDJhYzExMDAwMiIsImxhc3RVcGRhdGVUaW1lIjoxNTk0MzM2ODgyMDAwfSwiaWNBZ2VudElkIjoiNDI3OSIsImlzcyI6Imh0dHBzOi8vYXV0aC5kZXYubmljZS1pbmNvbnRhY3QuY29tIiwiYXVkIjoiaW5Db250YWN0IEF1dG8gQXR0ZW5kYW50QGluQ29udGFjdCBJbmMuIiwiaWNTUElkIjoiMTAxOTQiLCJpY0JVSWQiOjEzMzcxMzM3LCJuYW1lIjoiYW50b25pby5zY2hsYXBwYUBkbzMyLmNvbSIsInRlbmFudElkIjoiMTFlOTEwNzEtNzQzNi1mYjYwLWE3MTMtMDI0MmFjMTEwMDBhIiwiZXhwIjoxNTk1NzIxMDE2LCJpYXQiOjE1OTU3MTc0MTYsInRlbmFudCI6InBlcm1fam9lZG8zMjIwNjU1MDQ2IiwiaWNDbHVzdGVySWQiOiJkbzMyIn0.olv3xhrB5qyiGn2PLJerR3jOpFuQ-NZQ9ZVEyqyWcZwduIvAZie6vAA-pDDTeJRQfhsxF0iJOMWQ41PIc5WADekV9St0s504jQsTgHz9S-N5DIloiB5uOhfbV5LcBz_qwnHWRSNTpXAlLYQpTp7ROBSa8a60SyC3YkyoA-T6eF4",
      accessTokenExpiry: 3600,
      refreshToken: "2xqEBebyTk21hapKBFI8yg=="
    } as CxoneToken;
    httpMock.expectOne("http://localhost/public/authentication/v1/token").flush(response);
  });

  it("should call Token Refresh API ", async () => {
    const refreshToken = "YjFiZTI5YTcyNjMyNGEyYTgxNGU0ZmU5ZDcyYTEzOTI=";
    service.refreshToken("http://localhost/", refreshToken).subscribe((data: CxoneToken) => {
      expect(data.accessToken).toBe(
        // tslint:disable-next-line: max-line-length
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJ1c2VyOjExZWFiY2FiLWRlYmQtNzg1MC05ZDIzLTAyNDJhYzExMDAwMyIsInJvbGUiOnsibGVnYWN5SWQiOiJBZG1pbmlzdHJhdG9yIiwic2Vjb25kYXJ5Um9sZXMiOltdLCJpZCI6IjExZTkxMDcxLTc2MzYtNzRlMC1hYTg1LTAyNDJhYzExMDAwMiIsImxhc3RVcGRhdGVUaW1lIjoxNTk0MzM2ODgyMDAwfSwiaWNBZ2VudElkIjoiNDI3OSIsImlzcyI6Imh0dHBzOi8vYXV0aC5kZXYubmljZS1pbmNvbnRhY3QuY29tIiwiYXVkIjoiaW5Db250YWN0IEF1dG8gQXR0ZW5kYW50QGluQ29udGFjdCBJbmMuIiwiaWNTUElkIjoiMTAxOTQiLCJpY0JVSWQiOjEzMzcxMzM3LCJuYW1lIjoiYW50b25pby5zY2hsYXBwYUBkbzMyLmNvbSIsInRlbmFudElkIjoiMTFlOTEwNzEtNzQzNi1mYjYwLWE3MTMtMDI0MmFjMTEwMDBhIiwiZXhwIjoxNTk1NzIxMDE2LCJpYXQiOjE1OTU3MTc0MTYsInRlbmFudCI6InBlcm1fam9lZG8zMjIwNjU1MDQ2IiwiaWNDbHVzdGVySWQiOiJkbzMyIn0.olv3xhrB5qyiGn2PLJerR3jOpFuQ-NZQ9ZVEyqyWcZwduIvAZie6vAA-pDDTeJRQfhsxF0iJOMWQ41PIc5WADekV9St0s504jQsTgHz9S-N5DIloiB5uOhfbV5LcBz_qwnHWRSNTpXAlLYQpTp7ROBSa8a60SyC3YkyoA-T6eF4"
      );
      expect(data.accessTokenExpiry).toEqual(3600);
      expect(data.refreshToken).toBe("2xqEBebyTk21hapKBFI8yg==");
    });

    const response = {
      token:
        // tslint:disable-next-line: max-line-length
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJ1c2VyOjExZWFiY2FiLWRlYmQtNzg1MC05ZDIzLTAyNDJhYzExMDAwMyIsInJvbGUiOnsibGVnYWN5SWQiOiJBZG1pbmlzdHJhdG9yIiwic2Vjb25kYXJ5Um9sZXMiOltdLCJpZCI6IjExZTkxMDcxLTc2MzYtNzRlMC1hYTg1LTAyNDJhYzExMDAwMiIsImxhc3RVcGRhdGVUaW1lIjoxNTk0MzM2ODgyMDAwfSwiaWNBZ2VudElkIjoiNDI3OSIsImlzcyI6Imh0dHBzOi8vYXV0aC5kZXYubmljZS1pbmNvbnRhY3QuY29tIiwiYXVkIjoiaW5Db250YWN0IEF1dG8gQXR0ZW5kYW50QGluQ29udGFjdCBJbmMuIiwiaWNTUElkIjoiMTAxOTQiLCJpY0JVSWQiOjEzMzcxMzM3LCJuYW1lIjoiYW50b25pby5zY2hsYXBwYUBkbzMyLmNvbSIsInRlbmFudElkIjoiMTFlOTEwNzEtNzQzNi1mYjYwLWE3MTMtMDI0MmFjMTEwMDBhIiwiZXhwIjoxNTk1NzIxMDE2LCJpYXQiOjE1OTU3MTc0MTYsInRlbmFudCI6InBlcm1fam9lZG8zMjIwNjU1MDQ2IiwiaWNDbHVzdGVySWQiOiJkbzMyIn0.olv3xhrB5qyiGn2PLJerR3jOpFuQ-NZQ9ZVEyqyWcZwduIvAZie6vAA-pDDTeJRQfhsxF0iJOMWQ41PIc5WADekV9St0s504jQsTgHz9S-N5DIloiB5uOhfbV5LcBz_qwnHWRSNTpXAlLYQpTp7ROBSa8a60SyC3YkyoA-T6eF4",
      tokenExpirationTimeSec: 3600,
      refreshToken: "2xqEBebyTk21hapKBFI8yg=="
    } as CxoneRefreshTokenResponse;
    httpMock.expectOne("http://localhost/public/authentication/v1/refresh").flush(response);
  });
});
