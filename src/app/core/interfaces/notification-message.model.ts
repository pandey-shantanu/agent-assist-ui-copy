import { Metric } from './metric.model';
export interface NotificationMessage {
  hasSentiment: boolean;
  primaryAlertName: string;
  primaryAlertDescription: string;
  metric?: Metric;
  receptionDate?: Date;
}
