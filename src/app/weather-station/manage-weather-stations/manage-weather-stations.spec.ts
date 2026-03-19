import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageWeatherStations } from './manage-weather-stations';

describe('ManageWeatherStations', () => {
  let component: ManageWeatherStations;
  let fixture: ComponentFixture<ManageWeatherStations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageWeatherStations]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageWeatherStations);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
