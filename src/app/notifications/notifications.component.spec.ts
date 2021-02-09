import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';

import { NotificationsComponent } from './notifications.component';
import { ActivatedRoute } from '@angular/router';
import { MetricService } from '../core/services/metric.service';
import { MetricComponent } from '../metric/metric.component';
import { NotificationMessageComponent } from '../notification-message/notification-message.component';
import { observable, of, Subject, throwError } from 'rxjs';
import { NotificationService } from '../core/services/notification.service';
import { BrowserModule } from '@angular/platform-browser';
import { TypeMetric } from '../core/enum/type-metric.enum';

describe('NotificationsComponent', () => {
  let component: NotificationsComponent;
  let fixture: ComponentFixture<NotificationsComponent>;

  let mockNotificationService;
  let mockMetricService;
  let mockWindow;

  const metricMessage = {
                  command: "MESSAGE",
                  headers: {
                    connectionId: "42bc29f9-d638-4965-bcc6-f5bee55d47ec"
                  },
                  body: {
                    topic: "Nexidia.RTG.Updates",
                    messageType: "Nexidia.RTG.EnlightenUpdate",
                    configurationId: "revision 104",
                    enlightenResults: [{
                      enlightenModelGuid: "9fbf4ac5-17d7-4d90-a845-81333a05e494",
                      isValid: true,
                      score: 0.7861
                    }],
                    nxrtgAgentId: "1234",
                    nxrtgCallId: "70d0dfb5-9724-4130-b5c3-6cbc4e484fb5",
                    nxrtgSourceId: "8675309",
                    nxrtgSourceTime: "2014-01-10T13:49:01.034+5:00",
                    offsetMs: 64240
                  }
                };

  const sentimentScoreMessage = {
                  command: "MESSAGE",
                  headers: {
                    connectionId: "42bc29f9-d638-4965-bcc6-f5bee55d47ec"
                  },
                  body: {
                    topic: "Nexidia.RTG.Updates",
                    messageType: "Nexidia.RTG.EnlightenUpdate",
                    configurationId: "revision 104",
                    enlightenResults: [{
                      enlightenModelGuid: "36c30f7d-fef3-47f4-b9c0-b4411edd76c8",
                      isValid: true,
                      score: 0.7861
                    }],
                    nxrtgAgentId: "1234",
                    nxrtgCallId: "70d0dfb5-9724-4130-b5c3-6cbc4e484fb5",
                    nxrtgSourceId: "8675309",
                    nxrtgSourceTime: "2014-01-10T13:49:01.034+5:00",
                    offsetMs: 64240
                  }
                };

  const notificationMesage = {
            command: "MESSAGE",
            headers: {
              connectionId: "cb21effc-6f13-49e3-bb58-ab55dc809117"
            },
            body: {
              topic: "Nexidia.RTG.Notifications",
              messageType: "Nexidia.RTG.EventNotification",
              configurationId: "revision 104",
              enlightenResults: [{
                enlightenModelGuid: "bcc7d62a-d38a-4d3e-9184-1de2b066baad",
                isValid: true,
                score: 0.9673}],
              eventId: 3799,
              notificationCount: 7,
              notificationId: "a6845462-4ebb-4f5d-ba8a-d7e11a79aaf3",
              notificationPayload: {
                activeFrom: "2014-04-04T03:00:00-04:00",
                activeTo: "2014-05-29T03:00:00-04:00",
                hasPhraseExpression: true,
                hasSentiment: false,
                isOmission: true,
                isPrimaryAlertForAgent: true,
                isPrimaryAlertForSupervisor: false,
                isSecondaryAlertForAgent: true,
                isSecondaryAlertForSupervisor: true,
                primaryAlertArticleUrl: "http://server/articles/disclaimer.doc",
                primaryAlertDescription: "Remember to state the disclaimer.",
                primaryAlertName: "Disclaimer",
                secondaryAlertArticleUrl: "http://server/articles/disclaimer.doc",
                secondaryAlertDescription: "Omitting the disclaimer is risky!",
                secondaryAlertName: "Disclaimer!"
              },
              notificationType: "Secondary",
              nxrtgAgentId: "1234",
              nxrtgCallId: "70d0dfb5-9724-4130-b5c3-6cbc4e484fb5",
              nxrtgSourceId: "8675309",
              nxrtgSourceTime: "2014-01-10T13:49:01.034+5:00",
              offsetMs: 64240,
              secondaryNotificationCount: 4,
              stream: "Agent",
              workflowGuid: "e78f7d08-ae84-4248-ab99-7c20b7181d77"}
            };

  const metrics = [{
    guid: '9fbf4ac5-17d7-4d90-a845-81333a05e494',
    tag: 'Complaint',
    type: 'SENTIMENT_MODEL',
    frienly_name: 'Speech velocity',
    image_src: 'speech-velocity',
    is_sentiment_score: false
  },
  {
    guid: 'd8ecee45-f6d3-4929-8ef7-a8bd2410b525',
    tag: 'ActiveListening',
    type: 'SENTIMENT_MODEL',
    frienly_name: 'Active Listening',
    image_src: 'active-listening',
    is_sentiment_score: false
  },
  {
    guid: '36c30f7d-fef3-47f4-b9c0-b4411edd76c8',
    tag: 'Sentiment',
    type: 'SENTIMENT_MODEL',
    frienly_name: 'Sentiment',
    image_src: 'meh',
    is_sentiment_score: true
  }
  ];

  const rageOfMetric = {
    min: 70,
    max: 100,
    color: '#36C700',
    label: 'very good score',
    imageSrc: 'smile'
  };

  beforeEach(() => {
    mockMetricService = jasmine.createSpyObj(['getMetricByGuid', 'getMetrics', 'getRangeOfMetricByScore', 'getDisableMetricColor', 'getImageRelativePathbyImageName']);

    const activatedRouteStub = {
      queryParams: of({
        id_params: 'subscription'
      }),
      snapshot : {
        queryParams: {
          subscription : '+12345'
        }
      }
    };

    mockNotificationService = {
      wsSessionStatus: new Subject<boolean>(),
      subscribeToRTAEventsWithKey(subscriptionKey: string) {},
      unsubscribeToRTAEventsWithKey(subscriptionKey: string) {},
      topicMessages$: of(metricMessage)
    };

    mockWindow = {
      opener: {
        postMessage(str1: string, str2: string) {}
      }
    };

    TestBed.configureTestingModule({
      imports: [BrowserModule],
      providers: [
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: MetricService, useValue: mockMetricService },
        { provide: Window, useValue: mockWindow }
      ],
      declarations: [MetricComponent, NotificationMessageComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationsComponent);
    component = fixture.componentInstance;
    mockMetricService.getMetricByGuid.and.returnValue({});
    mockMetricService.getMetrics.and.returnValue(metrics);
    mockMetricService.getRangeOfMetricByScore.and.returnValue(rageOfMetric);

    fixture.detectChanges();
  });

  it('should create',  () => {
    expect(component).toBeTruthy();
  });

  it('should load the metric and change the score', () => {
    let score = 0;
    expect(component.metricList[0].score).toEqual(score);
    mockNotificationService.wsSessionStatus.next(true);
    expect(component.metricList[0].guid).toEqual(metricMessage.body.enlightenResults[0].enlightenModelGuid);
    score = component.multiplyByHundred(metricMessage.body.enlightenResults[0].score, TypeMetric.Metric);
    expect(component.metricList[0].score).toEqual(score);
  });

  it('should load the sentiment score and change the score', () => {
    let score = 0;
    expect(component.overallSentimentMetric.score).toEqual(score);

    mockNotificationService.topicMessages$ = of(sentimentScoreMessage);
    fixture.detectChanges();

    mockNotificationService.wsSessionStatus.next(true);
    expect(component.overallSentimentMetric.guid).toEqual(sentimentScoreMessage.body.enlightenResults[0].enlightenModelGuid);
    score = component.multiplyByHundred(sentimentScoreMessage.body.enlightenResults[0].score, TypeMetric.OveralSentiment);
    expect(component.overallSentimentMetric.score).toEqual(score);
  });

  it('should load the notification message', () => {
    expect(component.notificationList.length).toEqual(0);

    mockNotificationService.topicMessages$ = of(notificationMesage);
    fixture.detectChanges();

    mockNotificationService.wsSessionStatus.next(true);
    expect(component.notificationList.length).toEqual(1);
  });

  it('should get a message and send a post message', () => {
    mockNotificationService.topicMessages$ = of(notificationMesage);
    spyOn(window.parent, 'postMessage');
    fixture.detectChanges();
    mockNotificationService.wsSessionStatus.next(true);
    expect(window.parent.postMessage).toHaveBeenCalled();
  });

  it('should get the relative path when we load a notification message and has a image', () => {
    mockMetricService.getMetricByGuid.and.returnValue(metrics[0]);
    mockMetricService.getImageRelativePathbyImageName.and.returnValue("");
    mockNotificationService.topicMessages$ = of(notificationMesage);
    fixture.detectChanges();
    mockNotificationService.wsSessionStatus.next(true);
    expect(mockMetricService.getImageRelativePathbyImageName).toHaveBeenCalled();
  });

  it('should not load messages and show error in the log', () => {
    expect(component.notificationList.length).toEqual(0);
    console.log = jasmine.createSpy("log");
    mockNotificationService.topicMessages$ = throwError(new Error('Fake error'));
    fixture.detectChanges();

    mockNotificationService.wsSessionStatus.next(true);

    expect(console.log).toHaveBeenCalled();
  });

  it('should multiple the score by hundle',  () => {
    let value = component.multiplyByHundred(0.1, TypeMetric.Metric);
    expect(value).toEqual(10);
    value = component.multiplyByHundred(0.5, TypeMetric.Metric);
    expect(value).toEqual(50);
  });

  it('should expand panels and change of size of these',  () => {
    component.expandNotificationPanel = true;
    fixture.detectChanges();
    component.expanderNotificationMessagePanel();
    expect(component.heightNotificationPanel).toEqual(80);
    expect(component.heightMetricsPanel).toEqual(435);
    component.expandNotificationPanel = false;
    fixture.detectChanges();
    component.expanderNotificationMessagePanel();
    expect(component.heightNotificationPanel).toEqual(280);
    expect(component.heightMetricsPanel).toEqual(224);
  });
});
