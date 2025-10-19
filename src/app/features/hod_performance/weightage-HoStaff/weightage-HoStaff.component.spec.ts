import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeightageHoStaffComponent } from './weightage-HoStaff.component';

describe('WeightageHoStaffComponent', () => {
  let component: WeightageHoStaffComponent;
  let fixture: ComponentFixture<WeightageHoStaffComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WeightageHoStaffComponent]
    });
    fixture = TestBed.createComponent(WeightageHoStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
