import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ApiAbsoluteService } from './api.absolute.service';

describe("ApiAbsoluteService", () => {
  let service: ApiAbsoluteService;
  let httpMock: HttpTestingController;

  const url = "http://localhost/InContactAuthorizationServer/";

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [ApiAbsoluteService]
    });
    service = TestBed.inject(ApiAbsoluteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should call get request and get result", () => {
    service.get(url).subscribe( response => {
      expect(response.id).toEqual(1);
    });

    const mockRespose = {
      id: 1
    };

    httpMock.expectOne(url).flush(mockRespose);
  });

  it("should call get request and get error", () => {
    let response: any;
    let errResponse: any;

    service.get(url).subscribe( res => response = res, err => errResponse = err );

    const mockErrorResponse = { status: 400, statusText: 'Bad Request' };
    const data = { message: 'Invalid request parameters'};
    httpMock.expectOne(url).flush(data, mockErrorResponse);
    expect(errResponse.status).toBe(mockErrorResponse.status);
  });

  it("should call put request and get result", () => {
    service.put(url).subscribe( response => {
      expect(response.id).toEqual(1);
    });

    const mockRespose = {
      id: 1
    };

    httpMock.expectOne(url).flush(mockRespose);
  });

  it("should call post request and get result", () => {
    service.post(url).subscribe( response => {
      expect(response.id).toEqual(1);
    });

    const mockRespose = {
      id: 1
    };

    httpMock.expectOne(url).flush(mockRespose);
  });

  it("should call delete request and get result", () => {
    service.delete(url).subscribe( response => {
      expect(response.id).toEqual(1);
    });

    const mockRespose = {
      id: 1
    };

    httpMock.expectOne(url).flush(mockRespose);
  });
});
