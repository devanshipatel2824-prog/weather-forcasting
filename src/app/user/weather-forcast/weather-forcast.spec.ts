import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeatherForcast } from './weather-forcast';

describe('WeatherForcast', () => {
  let component: WeatherForcast;
  let fixture: ComponentFixture<WeatherForcast>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeatherForcast]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeatherForcast);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
