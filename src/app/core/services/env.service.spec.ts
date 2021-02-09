import { TestBed } from "@angular/core/testing";
import { environment } from 'src/environments/environment';
import { Region } from '../constants/region.constants';
import { EnvService } from "./env.service";

describe("EnvService", () => {
  let mockService: EnvService;
  let webSocketUrlna1: string;
  let webSocketUrlna2: string;
  let webSocketUrleu1: string;
  let webSocketUrlau1: string;
  let urlDomainna1: string;
  let urlDomainna2: string;
  let urlDomainau1: string;
  let urlDomaineu1: string;

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });
  webSocketUrlna1 = environment.na1_WebsocketServiceUrl;
  webSocketUrlna2 = environment.na2_WebsocketServiceUrl;
  webSocketUrleu1 = environment.eu1_WebsocketServiceUrl;
  webSocketUrlau1 = environment.au1_WebsocketServiceUrl;

  urlDomainna1 = "rtig-na1.dev.niceincontact.com";
  urlDomainna2 = "rtig-na2.dev.niceincontact.com";
  urlDomainau1 = "rtig-au1.dev.niceincontact.com";
  urlDomaineu1 = "rtig-eu1.dev.niceincontact.com";
  const expectedEnvName = "local";
  mockService = new EnvService();

  it("should be created", () => {
    const service: EnvService = TestBed.inject(EnvService);
    expect(service).toBeTruthy();
  });

  it("should return na1 region websocket service url", () => {
    spyOn(mockService, "urlDomain").and.callFake(() => {
      return urlDomainna1;
    });
    const url = mockService.GetWebsocketServiceUrl();
    expect(url).not.toBeUndefined();
    expect(url).toEqual(webSocketUrlna1);
  });

  it("should return na1 region websocket service url", () => {
    spyOn(mockService, "urlDomain").and.callFake(() => {
      return urlDomainna1;
    });
    const url = mockService.GetWebsocketServiceUrl();
    expect(url).not.toBeUndefined();
    expect(url).toEqual(webSocketUrlna1);
  });

  it("should return na2 region websocket service url", () => {
    spyOn(mockService, "urlDomain").and.callFake(() => {
      return urlDomainna2;
    });
    const url = mockService.GetWebsocketServiceUrl();
    expect(url).not.toBeUndefined();
    expect(url).toEqual(webSocketUrlna2);
  });

  it("should return au1 region websocket service url", () => {
    spyOn(mockService, "urlDomain").and.callFake(() => {
      return urlDomainau1;
    });
    mockService.GetWebsocketServiceUrlByRegion(Region.au1);
    const url = mockService.GetWebsocketServiceUrl();
    expect(url).not.toBeUndefined();
    expect(url).toEqual(webSocketUrlau1);
  });

  it("should return eu1 region websocket service url", () => {
    spyOn(mockService, "urlDomain").and.callFake(() => {
      return urlDomaineu1;
    });
    mockService.GetWebsocketServiceUrlByRegion(Region.eu1);
    const url = mockService.GetWebsocketServiceUrl();
    expect(url).not.toBeUndefined();
    expect(url).toEqual(webSocketUrleu1);
  });
  it("should return windows location hostname", () => {
    expect(mockService.urlDomain()).toBe(window.location.hostname);
  });
  it("should return environment name", () => {
    const env = mockService.GetEnvName();
    expect(env).not.toBeUndefined();
    expect(env).toEqual(expectedEnvName);
  });
});
