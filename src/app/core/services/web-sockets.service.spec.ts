import { TestBed } from '@angular/core/testing';
import { WebSocketsService } from './web-sockets.service';
import { EnvService } from './env.service';
import { WebSocketMessage } from '../interfaces/web-socket-messages/web-socket-message';
import { WebSocket, Server } from 'mock-socket';

describe('WebSocketsService', () => {
  const someWSUrl = "ws://localhost:8089";
  let webSocketService: WebSocketsService;

  const EnvServiceStub = {
    GetWebsocketServiceUrl() {
     return  someWSUrl;
    }
  };

  const mockServer: Server = new Server(someWSUrl);
  mockServer.on('connection', socket => {
    socket.on('message', data => {
      console.log(data);
      const dataWebSocket: WebSocketMessage = JSON.parse(data as string);
      if (dataWebSocket.command === "CONNECT")
      {
        if (dataWebSocket.headers.sessionToken === "bad token")
        {
          socket.send(JSON.stringify({
            body: {},
            headers: {
              sessionToken: "bad token"
            },
            command: "ERROR"
          }));
          socket.close();
          return;
        }
        socket.send(JSON.stringify({
          body: {},
          headers: {
            sessionToken: "someToken"
          },
          command: "CONNECTED"
        }));
        return;
      }
      if (dataWebSocket.command === "NOT_SUPPORTED_COMMAND"){
        socket.send(JSON.stringify({
          body: {},
          headers: {
            sessionToken: "bad token"
          },
          command: "ERROR"
        }));
      }
    });
    socket.on('close', () => {});
  });

  const ObservableMethodHandler = {
    nextMethod: (message: WebSocketMessage) => { },
    errorMethod: (errorMessage: WebSocketMessage) => { },
    exceptionMethod: (error: any) => { },
    completeMessage: () => { }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        WebSocketsService,
        { provide: EnvService, useValue: EnvServiceStub }
      ]
    });

    spyOn(window, "WebSocket").and.callFake((url, protocols) => {
      return new WebSocket(url, protocols);
    });

    webSocketService = TestBed.inject(WebSocketsService);
  });

  it('should be created with web socket url', () => {
    const service: WebSocketsService = TestBed.inject(WebSocketsService);
    expect((service as any).websocketServiceUrl).toBe(someWSUrl, "The websocket URL was not set on object creation.");
    expect((service as any).webSocket$).toBeDefined("The websocket subject was not being set on object creation.");
    expect(service).toBeTruthy();
  });

  it('should closeObserver be called on fail and notify WebSocket status', (done: DoneFn) => {
    expect((webSocketService as any).webSocket$).toBeDefined("The websocket subject was not being set on object creation.");
    expect(webSocketService).toBeTruthy();
    const msg: WebSocketMessage = {
      body: {},
      headers: {
        sessionToken: "bad token"
      },
      command: "CONNECT"
    };
    let statusCount = 0;
    webSocketService.connectionStatus.asObservable().subscribe((status) => {
      statusCount++;
      if (statusCount === 2)
      {
        expect(status).toBeFalsy("The websocket did not notified false status on connection closed.");
        expect((webSocketService as any).webSocket$).toBeDefined("The websocket subject was not being set on socket closed.");
        done();
      }
      expect(statusCount).toBeLessThanOrEqual(2);
    });
    webSocketService.webSocket$.subscribe((message) => {
      console.log(message);
    });
    webSocketService.sendMessage(msg);
  });

  it('should openObserver be called on success and notify WebSocket status', (done: DoneFn) => {
    expect((webSocketService as any).webSocket$).toBeDefined("The websocket subject was not being set on object creation.");
    expect(webSocketService).toBeTruthy();
    const msg: WebSocketMessage = {
      body: {},
      headers: {
        sessionToken: "someToken"
      },
      command: "CONNECT"
    };
    webSocketService.connectionStatus.asObservable().subscribe((status) => {
      expect(status).toBeTruthy("The websocket did not notified true status on connect");
      done();
    });
    webSocketService.webSocket$.subscribe((message) => {
      console.log(message);
    });
    webSocketService.sendMessage(msg);
  });

  it('should catch the error when the command has bad token', (done: DoneFn) => {
    expect((webSocketService as any).webSocket$).toBeDefined("The websocket subject was not being set on object creation.");
    expect(webSocketService).toBeTruthy();
    const msg: WebSocketMessage = {
      body: {},
      headers: {
        sessionToken: "bad token"
      },
      command: "CONNECT"
    };
    const exceptionMethodSpy = spyOn(ObservableMethodHandler, "exceptionMethod").and.callThrough();
    const completeMethodSpy = spyOn(ObservableMethodHandler, "completeMessage").and.callThrough();
    const nextMethodSpy = spyOn(ObservableMethodHandler, "nextMethod").and.callThrough();
    const errorMethodSpy = spyOn(ObservableMethodHandler, "errorMethod").and.callThrough();
    webSocketService.webSocket$.subscribe((message) => {
      console.log("This is the received message: ", message);
      expect(message.command).toBe("ERROR");
    });
    let statusCount = 0;
    webSocketService.connectionStatus.subscribe((status) => {
      statusCount++;
      console.log("Connection Status Count: ", statusCount);
      if (statusCount === 1)
      {
        expect(status).toBeTruthy();
      }
      if (statusCount === 2)
      {
        expect(status).toBeFalsy();
        expect(nextMethodSpy).not.toHaveBeenCalled();
        expect(exceptionMethodSpy).not.toHaveBeenCalled();
        expect(errorMethodSpy).toHaveBeenCalled();
        expect(completeMethodSpy).not.toHaveBeenCalled();
        done();
      }
      expect(statusCount).toBeLessThanOrEqual(2);
    });
    webSocketService.sendCommand(
      msg,
      "CONNECTED",
      ObservableMethodHandler.nextMethod,
      ObservableMethodHandler.errorMethod,
      ObservableMethodHandler.exceptionMethod,
      ObservableMethodHandler.completeMessage
    );
  });

  it('should catch the exception when something is wrong with the subject on command sent', (done: DoneFn) => {
    const EnvServiceStub2 = {
      GetWebsocketServiceUrl() {
        return  "ws://localhost:8699";
      }
    };

    const service: WebSocketsService = new WebSocketsService(EnvServiceStub2 as EnvService);

    const msg: WebSocketMessage = {
      body: {},
      headers: {
        sessionToken: "someToken"
      },
      command: "CONNECT"
    };

    service.connectionStatus.subscribe((status) => {
      console.log("Connection was closed.");
      expect(status).toBeFalsy();
      done();
    });
    service.sendCommand(
      msg,
      "CONNECTED",
      (message) => { expect(message).toBeNull(); expect(true).toBeFalsy(); },
      (message) => { expect(message).toBeNull(); expect(true).toBeFalsy(); },
      () => {
        console.log("Exception received.");
        expect(true).toBeTruthy();
      }
    );
  });

  it('should send a command successfully', (done: DoneFn) => {
    expect((webSocketService as any).webSocket$).toBeDefined("The websocket subject was not being set on object creation.");
    expect(webSocketService).toBeTruthy();
    const msg: WebSocketMessage = {
      body: {},
      headers: {
        sessionToken: "someToken"
      },
      command: "CONNECT"
    };

    const exceptionMethodSpy = spyOn(ObservableMethodHandler, "exceptionMethod").and.callThrough();
    const completeMethodSpy = spyOn(ObservableMethodHandler, "completeMessage").and.callThrough();
    const nextMethodSpy = spyOn(ObservableMethodHandler, "nextMethod").and.callThrough();
    const errorMethodSpy = spyOn(ObservableMethodHandler, "errorMethod").and.callThrough();
    webSocketService.webSocket$.subscribe((message) => {
      console.log("This is the received message: ", message);
      expect(message.command).toBe("CONNECTED");
      done();
    });

    webSocketService.sendCommand(
      msg,
      "CONNECTED",
      ObservableMethodHandler.nextMethod,
      ObservableMethodHandler.errorMethod,
      ObservableMethodHandler.exceptionMethod,
      ObservableMethodHandler.completeMessage
    );
  });

  it('should sent a message', (done: DoneFn) => {
    expect(webSocketService).toBeTruthy();
    expect((webSocketService as any).webSocket$).toBeDefined("The websocket subject was not being set on object creation.");
    const msg: WebSocketMessage = {
      body: {},
      headers: {
        sessionToken: "someToken"
      },
      command: "CONNECT"
    };
    webSocketService.webSocket$.asObservable().subscribe((message) => {
      expect(message.command).toBe("CONNECTED", "The websocket subject did not push the message");
      done();
    });
    webSocketService.sendMessage(msg);
  });

  it('should be complete and notify websocket status', (done: DoneFn) => {
    expect(webSocketService).toBeTruthy();
    expect((webSocketService as any).webSocket$).toBeDefined("The websocket subject was not being set on object creation.");
    webSocketService.connectionStatus.asObservable().subscribe((status) => {
      expect(status).toBeFalsy("The websocket did not notified the false status on close.");
      done();
    });
    const completeCall = spyOn(webSocketService.webSocket$, 'complete').and.callThrough();

    webSocketService.close();

    expect((webSocketService as any).webSocket$).toBeNull("The websocket object must be disposed.");
    expect(completeCall).toHaveBeenCalled();
  });

  it('should close be called on destroy', () => {
    const closeSpy = spyOn(webSocketService, "close").and.callThrough();
    webSocketService.ngOnDestroy();
    expect(closeSpy).toHaveBeenCalled();
  });
});
