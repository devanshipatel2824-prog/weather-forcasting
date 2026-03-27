import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StationMap } from './station-map';

describe('StationMap', () => {
  let component: StationMap;
  let fixture: ComponentFixture<StationMap>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StationMap]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StationMap);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
