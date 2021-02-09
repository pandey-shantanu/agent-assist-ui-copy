import { TestBed } from '@angular/core/testing';

import { MetricService } from './metric.service';
import { AppConstants } from '../constants/app-constants';

describe('MetricService', () => {
  let service: MetricService;
  const expectedMetric =  {
    guid: '142b1843-fd24-4718-a074-067984dbad63',
    tag: 'SpeechVelocity',
    type: 'SENTIMENT_MODEL',
    frienly_name: 'Speech velocity',
    image_src: 'speech-velocity',
    is_sentiment_score: false
  };

  const expectedRangeOfMetric = {
    min: -100,
    max: 0,
    color: '#E3E3E3',
    label: 'no score',
    severity: 'none',
    imageSrc: 'meh'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MetricService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should return all metrics', () => {
    const metrics = service.getMetrics();
    expect(metrics).toEqual(AppConstants.metrics);
  });
  it('should get metric by name', () => {
    const metric = service.getMetricByName(expectedMetric.frienly_name);
    expect(metric).toEqual(expectedMetric);
  });
  it('should get metric by guid', () => {
    const metric = service.getMetricByGuid(expectedMetric.guid);
    expect(metric).toEqual(expectedMetric);
  });
  it('should get range of metric by score', () => {
    const rangeOfMetric = service.getRangeOfMetricByScore(0);
    expect(rangeOfMetric).toEqual(expectedRangeOfMetric);
  });
  it('should get disabled metric color', () => {
    const color = service.getDisableMetricColor();
    expect(color).toBe(AppConstants.disableColor);
  });
  it('should get relative path by image name', () => {
    const relativePath = service.getImageRelativePathbyImageName("test");
    expect(relativePath).toBe("http://localhost/assets/images/sources/icons/test.svg");
  });

});
