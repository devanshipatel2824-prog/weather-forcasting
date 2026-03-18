import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeatherSuggestions } from './weather-suggestions';

describe('WeatherSuggestions', () => {
  let component: WeatherSuggestions;
  let fixture: ComponentFixture<WeatherSuggestions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeatherSuggestions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeatherSuggestions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
