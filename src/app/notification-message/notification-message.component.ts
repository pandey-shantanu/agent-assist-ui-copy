import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { timer, Subscription } from 'rxjs';
import { Metric } from '../core/interfaces/metric.model';
import { MetricService } from '../core/services/metric.service';

@Component({
  selector: 'app-notification-message',
  templateUrl: './notification-message.component.html',
  styleUrls: ['./notification-message.component.scss']
})
export class NotificationMessageComponent implements OnInit, OnDestroy {
  timeLabel: string;

  @Input() receptionDate: Date;
  @Input() label: string;
  @Input() message: string;
  @Input() metric: Metric;

  timerSubscribe: Subscription;
  msToSec = 1000;
  msToMin = 60000;
  msToHour = 3600000;
  msToDay = 86400000;

  constructor( private metricService: MetricService) {
    const defaultMetric = Object.assign({}, metricService.getMetricByGuid('f6919a44-6230-4720-a6b4-50d775ca07a2'));

    this.timeLabel = 'now';
    this.label = '';
    this.message = '';
    this.receptionDate = new Date();
    this.metric = defaultMetric;
   }

  ngOnInit(): void {
    this.timerSubscribe = this.observableTimer();
  }

  ngOnDestroy(): void {
    if (this.timerSubscribe)
    {
      this.timerSubscribe.unsubscribe();
    }
  }

  observableTimer(): Subscription {
    return timer(1000, 29000).subscribe(val => this.checkTimerLabel(val));
  }

  checkTimerLabel(value: number): void {
    if (value !== 0)
    {
      const currentDate = new Date();
      const difInTime = currentDate.getTime() - this.receptionDate.getTime();

      if (difInTime < this.msToMin)
      {
        this.timeLabel = this.fixedTime(difInTime, this.msToSec) + 's ago';
      }

      if (difInTime > this.msToMin && difInTime < this.msToHour)
      {
        this.timeLabel =  this.fixedTime(difInTime, this.msToMin) + 'm ago';
      }

      if (difInTime > this.msToHour && difInTime < this.msToDay)
      {
        this.timeLabel =  this.fixedTime(difInTime, this.msToHour) + 'h ago';
      }

      if (difInTime > this.msToDay)
      {
        this.timeLabel =  this.fixedTime(difInTime, this.msToDay) + 'd ago';
      }
    }
  }

  fixedTime(dividend: number, divider: number): string {
    return (dividend / divider).toFixed();
  }
}
