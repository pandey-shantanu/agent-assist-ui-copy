import { TestBed } from '@angular/core/testing';
import { WebSocketsService } from './web-sockets.service';
import { WebSocketMessage } from '../interfaces/web-socket-messages/web-socket-message';
import { WebSocket, Server } from 'mock-socket';
import { NotificationService } from './notification.service';
import { Observable, Subject } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { setupTestingRouter } from '@angular/router/testing';
import { TokenService } from './token.service';

describe('NotificationService', () => {
  let notificationService: NotificationService;
  let notificationServiceAny: any;

  const WebSocketsServiceStub = {
    sendMessage(msg: WebSocketMessage) { this.webSocket$.next(msg); },
    sendCommand(message: WebSocketMessage,
                commandTypeResponse: string,
                successCallback: (WebSocketMessage: WebSocketMessage) => void,
                errorCallBack?: (WebSocketMessage: WebSocketMessage) => void,
                exceptionCallBack?: (error: any) => void,
                completeCallBack?: () => void) {
                successCallback({
                  command: "CONNECTED",
                  headers: {
                    sessionToken: this.sessionToken
                  },
                  body: {}
                });
    },
    webSocket$: new Subject<WebSocketMessage>(),
    connectionStatus: new Subject<boolean>()
  };
  const WebSocketsServiceErrorResponseStub = {
    sendMessage(msg: WebSocketMessage) { this.webSocket$.next(msg); },
    sendCommand(message: WebSocketMessage,
                commandTypeResponse: string,
                successCallback: (WebSocketMessage: WebSocketMessage) => void,
                errorCallBack?: (WebSocketMessage: WebSocketMessage) => void,
                exceptionCallBack?: (error: any) => void,
                completeCallBack?: () => void) {
                errorCallBack({
                  command: "ERROR",
                  headers: {
                    sessionToken: this.sessionToken
                  },
                  body: {}
                });
    },
    webSocket$: new Subject<WebSocketMessage>(),
    connectionStatus: new Subject<boolean>()
  };
  const WebSocketsNoConnectionStub = {
    sendMessage(msg: WebSocketMessage) { this.webSocket$.next(msg); },
    sendCommand(message: WebSocketMessage,
                commandTypeResponse: string,
                successCallback: (WebSocketMessage: WebSocketMessage) => void,
                errorCallBack?: (WebSocketMessage: WebSocketMessage) => void,
                exceptionCallBack?: (error: any) => void,
                completeCallBack?: () => void) {
                errorCallBack({
                  command: "ERROR",
                  headers: {
                    sessionToken: this.sessionToken
                  },
                  body: {}
                });
    },
    webSocket$: new Subject<WebSocketMessage>(),
    connectionStatus: new Subject<boolean>()
  };

  function setupSuccess() {
    WebSocketsServiceStub.connectionStatus.next(true);

    TestBed.configureTestingModule({
      providers: [
        NotificationService,
        { provide: WebSocketsService, useValue: WebSocketsServiceStub },
        { provide: TokenService, useValue: {} }
      ]
    });

    notificationService = TestBed.inject(NotificationService);
    notificationServiceAny = notificationService as any;
  }

  function setupErrorWebSocketResponse() {
    WebSocketsServiceErrorResponseStub.connectionStatus.next(true);

    TestBed.configureTestingModule({
      providers: [
        NotificationService,
        { provide: WebSocketsService, useValue: WebSocketsServiceErrorResponseStub },
        { provide: TokenService, useValue: {} }
      ]
    });

    notificationService = TestBed.inject(NotificationService);
    notificationServiceAny = notificationService as any;
  }

  function setupWebSocketNoConnection() {
    TestBed.configureTestingModule({
      providers: [
        NotificationService,
        { provide: WebSocketsService, useValue: WebSocketsNoConnectionStub },
        { provide: TokenService, useValue: {} }
      ]
    });

    notificationService = TestBed.inject(NotificationService);
    notificationServiceAny = notificationService as any;
  }

  it('should be created', () => {
    setupSuccess();

    expect(notificationServiceAny.heartBeatHandlerId).toBeUndefined();
    expect(notificationServiceAny.topicMessages$).toBeDefined();
    expect(notificationServiceAny.subscriptions).toEqual({});
    expect(notificationService).toBeTruthy();
  });

  it('should open a connection successfully', (done: DoneFn) => {
    setupSuccess();

    notificationService.wsSessionStatus
      .asObservable()
      .subscribe((status) => {
        expect(status).toBeTruthy();
        done();
      });

    notificationService.InitConnection();
  });

  it('should not open a connection successfully', (done: DoneFn) => {
    setupErrorWebSocketResponse();

    notificationService.wsSessionStatus
      .asObservable()
      .subscribe((status) => {
        expect(status).toBeFalsy();
        done();
      });

    notificationService.InitConnection();
  });

  it('should request heartbeat and update heartbeat timer', () => {
    setupSuccess();

    expect(notificationServiceAny.heartBeatHandlerId).toBeUndefined();

    notificationService.sendHeartbeat();

    expect(notificationServiceAny.heartBeatHandlerId).toBeGreaterThan(0);
  });

  it('should request heartbeat after heartBeatHandlerId is resetted', () => {
    setupSuccess();

    expect(notificationServiceAny.heartBeatHandlerId).toBeUndefined();

    notificationServiceAny.heartBeatHandlerId = 1;
    spyOn(window, 'clearTimeout');

    notificationService.sendHeartbeat();

    expect(clearTimeout).toHaveBeenCalled();
  });

  it('should subscribe a key to RTA events', () => {
    setupSuccess();

    const spySendHeartbeat = spyOn(notificationService, 'sendHeartbeat');
    console.log = jasmine.createSpy("log");

    notificationService.subscribeToRTAEventsWithKey('1234567890');

    expect(spySendHeartbeat).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalled();
  });

  it('should not subscribe a key to RTA events', () => {
    setupErrorWebSocketResponse();

    const spySendHeartbeat = spyOn(notificationService, 'sendHeartbeat');
    console.log = jasmine.createSpy("log");

    notificationServiceAny.subscribeToRTAEventsWithKey('1234567890');

    expect(spySendHeartbeat).not.toHaveBeenCalled();
    expect(console.log).toHaveBeenCalled();
  });

  it('should unsubscribe a key to RTA events', () => {
    setupSuccess();

    const spySendHeartbeat = spyOn(notificationService, 'sendHeartbeat');
    console.log = jasmine.createSpy("log");

    notificationService.unsubscribeToRTAEventsWithKey('1234567890');

    expect(spySendHeartbeat).not.toHaveBeenCalled();
    expect(console.log).toHaveBeenCalled();
  });

  it('should not unsubscribe a key to RTA events', () => {
    setupErrorWebSocketResponse();

    const spySendHeartbeat = spyOn(notificationService, 'sendHeartbeat');
    console.log = jasmine.createSpy("log");

    notificationServiceAny.unsubscribeToRTAEventsWithKey('1234567890');

    expect(spySendHeartbeat).not.toHaveBeenCalled();
    expect(console.log).toHaveBeenCalled();
  });

  it('should heartBeatTimer be resetted when websocket got a false value', () => {
    setupWebSocketNoConnection();

    spyOn(window, 'clearTimeout');
    notificationServiceAny.heartBeatHandlerId = 1;

    WebSocketsNoConnectionStub.connectionStatus.next(false);

    expect(clearTimeout).toHaveBeenCalled();
  });

  it('should send a new message', (done: DoneFn) => {
    setupSuccess();

    notificationService.topicMessages$.subscribe((messageResponse) => {
      expect(messageResponse.command === "MESSAGE");
      done();
    });

    const message: WebSocketMessage = {
      command: "MESSAGE",
      headers: {
        connectionId: "54d3e077-6f70-4355-a6d0-0c188ebcf52b"
      },
      body: {
        topic: "Nexidia.RTG.Updates",
        enlightenResults: [
          { enlightenModelGuid: "00f620aa-73b2-4a92-9692-d06b272ed908", isValid: true, score: 0.2429 },
          { enlightenModelGuid: "45b110cd-cf29-4887-9c1e-370960604da3", isValid: true, score: 0.6236 },
          { enlightenModelGuid: "bcc7d62a-d38a-4d3e-9184-1de2b066baad", isValid: true, score: 0.6511 },
          { enlightenModelGuid: "e060d727-2235-4bdc-90b0-a035edd37724", isValid: true, score: 0.3933 },
          { enlightenModelGuid: "c66278ab-21b1-4a8b-8075-265fa0c91118", isValid: true, score: 0.4435 },
          { enlightenModelGuid: "a6837dd9-75ab-4bf3-a685-02822736650c", isValid: true, score: 0.427 },
          { enlightenModelGuid: "55fb30b0-f86d-4190-b225-d0cd01f636ff", isValid: true, score: 0.2835 },
          { enlightenModelGuid: "18bd2cae-6415-47c4-a73e-8a62c4dbe63f", isValid: true, score: 0.9094 },
          { enlightenModelGuid: "36c30f7d-fef3-47f4-b9c0-b4411edd76c8", isValid: true, score: 0.5367 }
        ],
        messageType: "Nexidia.RTG.EnlightenUpdate",
        nxrtgAgentId: 1234,
        offsetMs: 64240
      }
    };
    WebSocketsServiceStub.webSocket$.next(message);
  });
});
