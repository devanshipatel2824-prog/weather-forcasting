import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageWeatherData } from './manage-weather-data';

describe('ManageWeatherData', () => {
  let component: ManageWeatherData;
  let fixture: ComponentFixture<ManageWeatherData>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageWeatherData]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageWeatherData);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
