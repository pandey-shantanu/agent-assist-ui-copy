import {Injectable, OnDestroy} from '@angular/core';
import { WebSocketsService } from './web-sockets.service';
import { filter } from 'rxjs/operators';
import { WebSocketMessage } from '../interfaces/web-socket-messages/web-socket-message';
import { TokenService } from './token.service';
import { Subject, Subscription } from 'rxjs';
import {TokenInvalid} from '../constants/token-invalid.constants';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly sessionToken: string;
  private subscriptions: any;
  private heartBeatHandlerId: number;

  constructor(private webSocketService: WebSocketsService, private tokenService: TokenService) {
    this.sessionToken = tokenService.accessToken;
    this.webSocketService.connectionStatus.subscribe((status) => this.webSocketEventsHandler(status));
    this.InitConnection();
    this.subscriptions = {};
  }

  wsSessionStatus: Subject<boolean> = new Subject<boolean>();

  topicMessages$ = this.webSocketService.webSocket$.pipe(
    filter(message => message.command === "MESSAGE")
  );

  public InitConnection(): void {
    this.subscriptions = {};
    const msg = {
      command: "CONNECT",
      headers: {
        sessionToken: this.sessionToken
      },
      body: {}
    };

    this.webSocketService.sendCommand(
      msg,
      "CONNECTED",
      (message) => {
        console.log(message);
        this.wsSessionStatus.next(true);
      },
      (error) => {
        this.wsSessionStatus.next(false);
      }
    );
  }

  private webSocketEventsHandler(status: boolean){
    if (!status)
    {
      if (this.heartBeatHandlerId)
      {
        clearTimeout(this.heartBeatHandlerId);
        this.heartBeatHandlerId = 0;
      }
      this.wsSessionStatus.next(false);
    }
  }

  public subscribeToRTAEventsWithKey(subscriptionKey: string): void {
    // Check subscription list to make sure we don't keep subscribing
    if (!this.subscriptions.hasOwnProperty(subscriptionKey)) {
      this.subscriptions[subscriptionKey] = true;

      const msg: WebSocketMessage = {
        command: "SUBSCRIBE",
        headers: {
           sessionToken: this.sessionToken
        },
        body: {
          topic: subscriptionKey
        }
      };
      this.webSocketService.sendCommand(
        msg,
        "SUBSCRIBED",
        (response: WebSocketMessage) => {
          console.log("succeed", response);
          this.sendHeartbeat();
        },
        (response: WebSocketMessage) => {
          console.log("subscribe error", response);
        }
      );
    }
  }

   sendHeartbeat() {
     if (this.heartBeatHandlerId) {
       clearTimeout(this.heartBeatHandlerId);
     }
     const msg: WebSocketMessage = {
       command: "HEARTBEAT",
       headers: {
         sessionToken: this.sessionToken
       },
       body: {}
     };
     this.webSocketService.sendMessage(msg);
     this.heartBeatHandlerId = setTimeout(this.sendHeartbeat.bind(this), 10000);
  }

  unsubscribeToRTAEventsWithKey(subscriptionKey: string) {
    const msg: WebSocketMessage = {
      command: "UNSUBSCRIBE",
      headers: {
        sessionToken: this.sessionToken
      },
      body: {
        topic: subscriptionKey
      }
    };
    this.webSocketService.sendCommand(
      msg,
      "UNSUBSCRIBED",
      (response: WebSocketMessage) => {
        console.log("unsubscription succeed", response);
      },
      (response: WebSocketMessage) => {
        console.log("unsubscription error", response);
      }
    );
  }
}
