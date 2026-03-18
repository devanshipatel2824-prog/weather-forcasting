import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStation } from './view-station';

describe('ViewStation', () => {
  let component: ViewStation;
  let fixture: ComponentFixture<ViewStation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewStation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewStation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
