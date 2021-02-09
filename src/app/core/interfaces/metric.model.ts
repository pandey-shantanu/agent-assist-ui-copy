export interface Metric {
  guid: string;
  tag: string;
  type: string;
  frienly_name: string;
  image_src: string;
  is_sentiment_score: boolean;
  score?: number;
  state_color?: string;
}
