import {Injectable, OnDestroy} from '@angular/core';
import { EnvService } from './env.service';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { filter } from 'rxjs/operators';
import { WebSocketMessage } from '../interfaces/web-socket-messages/web-socket-message';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketsService implements OnDestroy {

  webSocket$: WebSocketSubject<WebSocketMessage>;
  connectionStatus: Subject<boolean> = new Subject<boolean>();

  private readonly websocketServiceUrl: string;

  constructor(envService: EnvService) {
    this.websocketServiceUrl = envService.GetWebsocketServiceUrl();
    this.InitSocketSubject();
  }

  public InitSocketSubject(): void {
    if (!this.webSocket$ || this.webSocket$.closed) {
      this.webSocket$ = this.getNewWebSocket();
    }
  }

  private getNewWebSocket() {
    return webSocket<WebSocketMessage>({
      url: this.websocketServiceUrl,
      openObserver: {
        next: () => {
          console.log('WebSocket connection ok');
          this.connectionStatus.next(true);
        }
      },
      closeObserver: {
        next: () => {
          console.log('WebSocket connection closed.');
          this.close();
          this.InitSocketSubject();
        }
      },
    });
  }

  sendMessage(msg: WebSocketMessage) {
    if (this.webSocket$ === null){
      this.InitSocketSubject();
    }
    this.webSocket$.next(msg);
  }

  sendCommand(message: WebSocketMessage,
              commandTypeResponse: string,
              successCallback: (WebSocketMessage) => void,
              errorCallBack?: (WebSocketMessage) => void,
              exceptionCallBack?: (error: any) => void,
              completeCallBack?: () => void
  ): void {
    this.sendMessage(message);
    const commandTopic = this.webSocket$.pipe(
      filter(msg => msg.command === commandTypeResponse || msg.command === "ERROR")
    );
    const subscription = commandTopic.subscribe(
      (msg) => {
        if ((!!errorCallBack && msg.command === "ERROR") || (!!errorCallBack && msg.command !== commandTypeResponse))
        {
          errorCallBack(msg);
          return;
        }
        successCallback(msg);
        subscription.unsubscribe();
      },
      error => {
        if (!!exceptionCallBack){
          exceptionCallBack(error);
        }
        console.log('Command error: ', error);
        subscription.unsubscribe();
      },
      () => {
        if (!!completeCallBack){
          completeCallBack();
        }
        console.log('Command completed.');
      }
    );
  }

  close() {
    this.webSocket$.complete();
    this.webSocket$.unsubscribe();
    this.webSocket$ = null;
    this.connectionStatus.next(false);
  }

  ngOnDestroy() {
    this.close();
  }
}
