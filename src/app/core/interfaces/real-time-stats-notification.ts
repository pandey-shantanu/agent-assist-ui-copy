import { EnlightenResult } from './enlighten_result.model';
import { NotificationMessage } from './notification-message.model';

export interface RealTimeStatsNotification {
  topic?: string;
  messageType?: string;
  nxrtgAgentId?: number;
  offsetMs?: number;
  enlightenResults?: EnlightenResult[];
  notificationPayload?: NotificationMessage;
  responseCode?: number;
  responseText?: string;
}
