import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeatherSearch } from './weather-search';

describe('WeatherSearch', () => {
  let component: WeatherSearch;
  let fixture: ComponentFixture<WeatherSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeatherSearch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeatherSearch);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
