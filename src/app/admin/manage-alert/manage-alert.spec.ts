import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAlert } from './manage-alert';

describe('ManageAlert', () => {
  let component: ManageAlert;
  let fixture: ComponentFixture<ManageAlert>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageAlert]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageAlert);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
