import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Region } from '../constants/region.constants';

@Injectable({
  providedIn: 'root'
})
export class EnvService {
  webSocketUrl: string;
  constructor() {}

  urlDomain(): string {
    return window.location.hostname;
  }

  GetWebsocketServiceUrl(): string {
    const splitted = this.urlDomain().split('.', 1);
    this.webSocketUrl = environment.na1_WebsocketServiceUrl;
    if (splitted[0].length > 0) {
      const region = splitted[0].split('-', 2);
      if (region.length > 0 && region[1] in Region)
      {
        console.log(region[1]);
        this.GetWebsocketServiceUrlByRegion(region[1]);
      }
    }
    return this.webSocketUrl;
  }

  GetWebsocketServiceUrlByRegion(region: string): void {
    if (region === Region.na1) {
      this.webSocketUrl = environment.na1_WebsocketServiceUrl;
    }
    if (region === Region.na2) {
      this.webSocketUrl = environment.na2_WebsocketServiceUrl;
    }
    if (region === Region.au1) {
      this.webSocketUrl = environment.au1_WebsocketServiceUrl;
    }
    if (region === Region.eu1) {
      this.webSocketUrl = environment.eu1_WebsocketServiceUrl;
    }
  }

  GetEnvName(): string {
    return environment.name;
  }
}
