import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { trigger, style, transition, animate, group, query, stagger, animateChild } from '@angular/animations';
import { ActivatedRoute } from '@angular/router';
import { NotificationMessage } from '../core/interfaces/notification-message.model';
import { PostMessageEvent } from '../core/interfaces/post-message-event.model';
import { PostMessageType } from '../core/constants/postmessagetype.constants';
import { MetricService } from '../core/services/metric.service';
import { Metric } from '../core/interfaces/metric.model';
import { RangeOfMetric } from '../core/interfaces/range-of-metric.model';
import { NotificationService } from '../core/services/notification.service';
import { WebSocketMessage } from '../core/interfaces/web-socket-messages/web-socket-message';
import { TypeMetric } from '../core/enum/type-metric.enum';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  animations: [
    trigger('items', [
      transition(':enter', [
        style({ transform: 'translateY(-20%)' }),
        animate(500)
      ]),
      transition(':leave', [
        group([
          // animate('0.1s ease', style({ transform: 'translateY(20%)' })),
          animate('0.5s 0.2s ease', style({ opacity: 0 }))
        ])
      ])
    ]),
    trigger('list', [
      transition(':enter', [
        query('@items', stagger(300, animateChild()), { optional: true })
      ]),
    ])
  ]
})
export class NotificationsComponent implements OnInit, OnDestroy {
  overallSentimentMetric: Metric;
  notificationList: Array<NotificationMessage>;
  metricList: Array<Metric>;
  newMessage: NotificationMessage;
  subscriptionKey: string;
  heightNotificationPanel: number;
  heightMetricsPanel: number;
  expandNotificationPanel: boolean;
  hasMessage: boolean;
  count: number;
  reconnectTimer: any;

  private topicMessageSubscription: Subscription = null;

  constructor(
    private notificationService: NotificationService,
    private activatedRoute: ActivatedRoute,
    private metricService: MetricService
  ) {
    // Get query string value or default to test value
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.subscription){
        this.subscriptionKey = params.subscription;
      }
      else {
        this.subscriptionKey = '';
      }
  });
    this.heightNotificationPanel = 280;
    this.heightMetricsPanel = 224;
    this.expandNotificationPanel = true;
    this.count = 0;
  }

  ngOnInit() {
    this.notificationList = new Array<NotificationMessage>();
    this.metricList = new Array<Metric>();
    this.hasMessage = false;

    // Load all metric we have defined in our app-constants configuration
    if (this.metricList && this.metricList.length === 0)
    {
       for (const metric of this.metricService.getMetrics()) {
        if (metric.is_sentiment_score) {
          const sentScoreUI = Object.assign({}, metric);
          sentScoreUI.score = 0;
          this.overallSentimentMetric = sentScoreUI;
        }
        else {
          const metricUi = Object.assign({}, metric);
          metricUi.score = 0;
          this.metricList.push(metricUi);
        }
       }
    }

    this.notificationService.wsSessionStatus.subscribe((status) => {
      if (status)
      {
        this.unsubcribeTimer();
        this.notificationService.subscribeToRTAEventsWithKey(this.subscriptionKey);
        this.count = 0;
      } else {
        // Here is where we have to count the tries until 5 times, after the 5 times we are gonna redirect to landing page with a message.
        // add a delay or the web socket will not send anything.
        this.unsubcribeTimer();
        if (this.count < 5)
        {
          this.count++;
          console.log('Trying reconnect', this.count);
          this.reconnectTimer = setTimeout(() => {
            this.notificationService.InitConnection();
          }, 20000);
        }
      }
      this.registerSubscribeEvent();
    });

	   this.setExpanderImage();
  }

  private unsubcribeTimer(){
    if (this.reconnectTimer && this.reconnectTimer !== 0) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = 0;
    }
  }
  private registerSubscribeEvent(){
    if (this.topicMessageSubscription === null) {
      this.topicMessageSubscription = this.notificationService.topicMessages$.subscribe({
          next: (response) => this.updateComponent(response),
          error: (err: any) => {
            console.log('Error: %o', err);
            // Here we have to implement the retry to start the session again if we have the connexion lost
          },
          complete: () => {
            console.log('TranscriptResponse Complete');
          }
        }
      );
    }
  }

  private updateComponent(response: WebSocketMessage){
    try{
      if (response.body.messageType === "Nexidia.RTG.EnlightenUpdate") {
        for (const newMetric of response.body.enlightenResults) {
          if (newMetric.isValid) {
            const currentMetric = this.metricList.find(metric => metric.guid === newMetric.enlightenModelGuid);

            if (currentMetric) {
                  currentMetric.score = this.multiplyByHundred(newMetric.score, TypeMetric.Metric);
            }
            else {
              if (this.overallSentimentMetric.guid === newMetric.enlightenModelGuid) {
                this.overallSentimentMetric.score = this.multiplyByHundred(newMetric.score, TypeMetric.OveralSentiment);
                const messageText = this.overallSentimentMetric.frienly_name;
                const messageEvent = this.getMessageEventData(messageText, this.overallSentimentMetric.score);
                this.sendPostMessageEventToMax(PostMessageType.overallSentiment, messageEvent);
              }
            }
          }
        }
      }
      else if (response.body.messageType === "Nexidia.RTG.EventNotification") {
        if (response.body.notificationPayload && response.body.notificationPayload.primaryAlertName) {
          response.body.notificationPayload.receptionDate = new Date();

          const enlighten = response.body.enlightenResults.find(met => met.isValid);

          if (enlighten) {
            const messageMetric = this.metricService.getMetricByGuid(enlighten.enlightenModelGuid);
            let notificationMetric = { guid: 0, score: 0 } as any;
            if (messageMetric) {
              notificationMetric =  Object.assign({}, messageMetric);
              notificationMetric.score = this.multiplyByHundred(enlighten.score, TypeMetric.Notification);

              const messageText = response.body.notificationPayload.primaryAlertName;
              const notificationMessageEvent = this.getMessageEventData(messageText, notificationMetric.score, messageMetric.image_src);
              this.sendPostMessageEventToMax(PostMessageType.notificationMessage, notificationMessageEvent);
            }
            response.body.notificationPayload.metric = notificationMetric;

            this.notificationList.unshift(response.body.notificationPayload);

            if (!this.hasMessage) {
              this.hasMessage = true;
            }
          }
        }
      }
    }
    catch (exception) {
      console.log("Error to mapping the message:", exception);
    }
  }

  getMessageEventData(messageText: string, score: number, imgSrc?: string): PostMessageEvent {
    const rangeOfMetric = this.getEnlightenModelData(score);
    return {
      eventMessageText: messageText,
      eventMessageImageLocation: imgSrc ? this.metricService.getImageRelativePathbyImageName(imgSrc) : imgSrc,
      eventMessageStateColor: rangeOfMetric.color,
      eventMessageSeverity: rangeOfMetric.severity
    };
  }

  private sendPostMessageEventToMax(eventType: string, eventData: PostMessageEvent) {
    const opener = window.opener || window.parent;
    const eventObj = {
      messageType: eventType,
      issuer: PostMessageType.issuer,
      contactId: this.subscriptionKey,
      event: eventData
    };
    opener.postMessage(eventObj, '*');
  }

  getEnlightenModelData(score: number): RangeOfMetric {
    return this.metricService.getRangeOfMetricByScore(score);
  }

  multiplyByHundred(score: number, typeMetric: TypeMetric): number {
    let value = score * 100;

    if ( value < typeMetric) {
      value = typeMetric;
    }

    return value;
  }

  ngOnDestroy(): void {
    this.notificationService.unsubscribeToRTAEventsWithKey(this.subscriptionKey);
    if (this.topicMessageSubscription)
    {
      this.topicMessageSubscription.unsubscribe();
      this.topicMessageSubscription = null;
    }
  }

  expanderNotificationMessagePanel(): void {
    if (this.expandNotificationPanel) {
      this.heightNotificationPanel = 80;
      this.heightMetricsPanel = 435;
    }
    else {
      this.heightNotificationPanel = 280;
      this.heightMetricsPanel = 224;
    }
    this.expandNotificationPanel = !this.expandNotificationPanel;
    this.setExpanderImage();
  }

	setExpanderImage(): void {
    const expanderButton = document.querySelector(".expander-button");

    if (expanderButton) {
        if (this.expandNotificationPanel)
        {
          expanderButton.setAttribute("style", "background-image: url('assets/images/sources/angle-double-blue.svg')");
        }
        else
        {
          expanderButton.setAttribute("style", "background-image: url('assets/images/sources/angle-double-blue-down.svg')");
        }
		}
	}
}
