import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { MetricService } from '../core/services/metric.service';
import { RangeOfMetric } from '../core/interfaces/range-of-metric.model';

@Component({
  selector: 'app-metric',
  templateUrl: './metric.component.html',
  styleUrls: ['./metric.component.scss']
})
export class MetricComponent implements OnInit, OnChanges {
  imageSrc: string;
  svgIcon: SVGElement;
  stateColor: string;
  @Input() percent: number;
  @Input() label: string;
  @Input() showLabel: boolean;
  @Input() metricId: string;
  @Input() radius: number;
  @Input() strokeWidth: number;
  @Input() fontSize: number;
  @Input() imageSize: number;
  @Input() imageName: string;
  @Input() useDefaultInfo: boolean;

  constructor(private metricService: MetricService) {
    this.percent = 0;
    this.label = '';
    this.showLabel = true;
    this.imageSrc =  '';
    this.radius = 24;
    this.strokeWidth = 4;
    this.fontSize = 14;
    this.imageSize = 23;
    this.useDefaultInfo = false;
  }

  ngOnInit(): void {
    this.getImageSrcByMecricId();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getImageSrcByMecricId();
  }

  getDiameter(): string {
    return (this.radius * 2) + 'px';
  }

  getImageSrcByMecricId(): void {
    const rangeOfMetric = this.metricService.getRangeOfMetricByScore(this.percent);

    if (rangeOfMetric)
    {
      this.stateColor = rangeOfMetric.color;

      if (this.useDefaultInfo) {
        this.label = rangeOfMetric.label;
        this.imageName = rangeOfMetric.imageSrc;
      }
    }
    else {
      this.stateColor = this.metricService.getDisableMetricColor();
    }

    if (this.metricId === undefined || this.metricId === null)
    {
      this.metricId = 'interruption';
    }

    this.imageSrc = `assets/images/sources/icons/${this.imageName}.svg`;
  }
}
