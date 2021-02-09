import { SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MetricService } from '../core/services/metric.service';

import { MetricComponent } from './metric.component';
import { BrowserModule } from '@angular/platform-browser';

describe('MetricComponent', () => {
  let component: MetricComponent;
  let fixture: ComponentFixture<MetricComponent>;
  let mockMetricService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ BrowserModule ],
      declarations: [ MetricComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    mockMetricService = jasmine.createSpyObj(['getRangeOfMetricByScore', 'getDisableMetricColor']);

    TestBed.configureTestingModule({
      providers: [{provide: MetricService, useValue: mockMetricService}],
      declarations: [ MetricComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MetricComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should show the defauld color of metric (#E3E3E3)', () => {
    mockMetricService.getDisableMetricColor.and.returnValue('#E3E3E3');
    component.percent = 0;
    fixture.detectChanges();
    expect(component.stateColor).toEqual('#E3E3E3');
  });

  it('should show the bad score color of metric (#FF2B53)', () => {
    mockMetricService.getRangeOfMetricByScore.and.returnValue({
      min: 0,
      max: 30,
      color: '#FF2B53',
      label: 'bad score',
      imageSrc: 'inappropriate-action'
    });
    component.percent = 20;
    fixture.detectChanges();
    expect(component.stateColor).toEqual('#FF2B53');
  });

  it('should show the neutral score color of metric (#FFBA1F)', () => {
    mockMetricService.getRangeOfMetricByScore.and.returnValue({
      min: 30,
      max: 70,
      color: '#FFBA1F',
      label: 'neutral score',
      imageSrc: 'meh'
    });
    component.percent = 50;
    fixture.detectChanges();
    expect(component.stateColor).toEqual('#FFBA1F');
  });

  it('should show the very good score color of metric (#36C700)', () => {
    mockMetricService.getRangeOfMetricByScore.and.returnValue({
      min: 70,
      max: 100,
      color: '#36C700',
      label: 'very good score',
      imageSrc: 'smile'
    });
    component.percent = 90;
    fixture.detectChanges();
    expect(component.stateColor).toEqual('#36C700');
  });

  it('should show label "very good score" and image name "smile" with the metric user the default info', () => {
    mockMetricService.getRangeOfMetricByScore.and.returnValue({
      min: 70,
      max: 100,
      color: '#36C700',
      label: 'very good score',
      imageSrc: 'smile'
    });
    component.useDefaultInfo = true;
    component.percent = 100;
    fixture.detectChanges();
    expect(component.label).toEqual('very good score');
    expect(component.imageSrc).toEqual('assets/images/sources/icons/smile.svg');
  });

  it('should change the score and call getImageSrcByMecricId', () => {
    spyOn(component, 'getImageSrcByMecricId');
    component.percent = 20;
    fixture.detectChanges();
    expect(component.percent).toEqual(20);
    component.percent = 40;
    component.ngOnChanges({
      percent: new SimpleChange(20, component.percent, false)
    });
    fixture.detectChanges();
    expect(component.percent).toEqual(40);
    expect(component.getImageSrcByMecricId).toHaveBeenCalled();
  });

});
