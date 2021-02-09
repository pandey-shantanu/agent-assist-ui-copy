import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Subscription } from 'rxjs';

import { NotificationMessageComponent } from './notification-message.component';
import { MetricComponent } from '../metric/metric.component';
import { BrowserModule } from '@angular/platform-browser';

describe('NotificationMessageComponent', () => {
  let component: NotificationMessageComponent;
  let fixture: ComponentFixture<NotificationMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserModule],
      declarations: [NotificationMessageComponent, MetricComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    TestBed.configureTestingModule({

    }).compileComponents();

    fixture = TestBed.createComponent(NotificationMessageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should divide 2 by 2 and return 1', () => {
    fixture.detectChanges();
    const result = component.fixedTime(2, 2);
    expect(result).toEqual("1");
  });

  it('should divide 3 by 2 and return 2 rounded', () => {
    fixture.detectChanges();
    const result = component.fixedTime(3, 2);
    expect(result).toEqual("2");
  });

  it('should divide 7 by 3 and return 2 rounded', () => {
    fixture.detectChanges();
    const result = component.fixedTime(3, 2);
    expect(result).toEqual("2");
  });

  it('should show label "now" when with start the element', () => {
    fixture.detectChanges();
    component.checkTimerLabel(0);
    expect(component.timeLabel).toEqual('now');
  });

  it('should show label "1s ago" when the reception date is more 1 sec. of current date', () => {
    const recebeDate = new Date();
    recebeDate.setSeconds(recebeDate.getSeconds() - 1);

    component.receptionDate = recebeDate;
    fixture.detectChanges();

    component.checkTimerLabel(1);

    expect(component.timeLabel).toEqual('1s ago');
  });

  it('should show label "1m ago" when the reception date is more 1 min. of current date', () => {
    const recebeDate = new Date();
    recebeDate.setMinutes(recebeDate.getMinutes() - 1);
    console.log(recebeDate);

    component.receptionDate = recebeDate;
    fixture.detectChanges();

    component.checkTimerLabel(2);

    expect(component.timeLabel).toEqual('1m ago');
  });

  it('should show label "1h ago" when the reception date is more 1 houre of current date', () => {
    const recebeDate = new Date();
    recebeDate.setHours(recebeDate.getHours() - 2);

    component.receptionDate = recebeDate;
    fixture.detectChanges();

    component.checkTimerLabel(3);

    expect(component.timeLabel).toEqual('2h ago');
  });

  it('should show label "1d ago" when the reception date is more 1 day of current date', () => {
    const recebeDate = new Date();
    recebeDate.setHours(recebeDate.getHours() - 25);

    component.receptionDate = recebeDate;
    fixture.detectChanges();

    component.checkTimerLabel(4);

    expect(component.timeLabel).toEqual('1d ago');
  });

  it('should start the timer and change the the time label', () => {
    spyOn(component, 'checkTimerLabel');
    fixture.detectChanges();
    expect(component.timeLabel).toEqual('now');
    expect(component.checkTimerLabel).toHaveBeenCalledTimes(0);
  });

  it('test for timer initialized in ngOnInit', fakeAsync(() => {
    spyOn(component, 'checkTimerLabel');
    fixture.detectChanges();
    expect(component.checkTimerLabel).toHaveBeenCalledTimes(0);
    tick(29000);
    expect(component.checkTimerLabel).toHaveBeenCalledTimes(1);
    tick(29000);
    expect(component.checkTimerLabel).toHaveBeenCalledTimes(2);
    component.timerSubscribe.unsubscribe();
  }));
});
