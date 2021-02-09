import { Injectable } from '@angular/core';
import { Metric } from '../interfaces/metric.model';
import { AppConstants } from '../constants/app-constants';

@Injectable({
  providedIn: 'root'
})
export class MetricService {
  constructor() { }

  getMetrics(): Metric[] {
    return AppConstants.metrics;
  }

  getMetricByName(name: string): Metric {
    return AppConstants.metrics.find(metric => metric.frienly_name.toLowerCase() === name.toLowerCase());
  }

  getMetricByGuid(guid: string): Metric {
    return AppConstants.metrics.find(metric => metric.guid === guid);
  }

  getRangeOfMetricByScore(score: number) {
    return AppConstants.rangesOfMetric.find(range => score > range.min && score <= range.max);
  }

  getDisableMetricColor(): string {
    return AppConstants.disableColor;
  }

  getImageRelativePathbyImageName(imgFileName: string): string {
    const imageRelativePath = this.getImageRelativePath();
    return imageRelativePath + imgFileName + '.svg';
  }

  getImageRelativePath(): string {
    const location = window.location;
    const pathName = location.pathname.replace("/index.html", "").replace("/context.html", "");

    const imgPath = '/assets/images/sources/icons/';
    return location.protocol + '//' + location.hostname + pathName + imgPath;
  }
}
