import { RealTimeStatsNotification } from '../real-time-stats-notification';
import { WebSocketHeaderMessage } from './web-socket-header-message';

export interface WebSocketMessage{
  command: string;
  headers: WebSocketHeaderMessage;
  body?: RealTimeStatsNotification;
}
