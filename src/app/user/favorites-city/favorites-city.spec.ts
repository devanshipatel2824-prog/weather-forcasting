import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoritesCity } from './favorites-city';

describe('FavoritesCity', () => {
  let component: FavoritesCity;
  let fixture: ComponentFixture<FavoritesCity>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavoritesCity]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavoritesCity);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
