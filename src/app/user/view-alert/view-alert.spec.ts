import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAlert } from './view-alert';

describe('ViewAlert', () => {
  let component: ViewAlert;
  let fixture: ComponentFixture<ViewAlert>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewAlert]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAlert);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
