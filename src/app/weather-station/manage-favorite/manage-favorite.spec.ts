import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageFavorite } from './manage-favorite';

describe('ManageFavorite', () => {
  let component: ManageFavorite;
  let fixture: ComponentFixture<ManageFavorite>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageFavorite]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageFavorite);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
