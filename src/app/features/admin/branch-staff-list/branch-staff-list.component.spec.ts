import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchStaffListComponent } from './branch-staff-list.component';

describe('BranchStaffListComponent', () => {
  let component: BranchStaffListComponent;
  let fixture: ComponentFixture<BranchStaffListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BranchStaffListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BranchStaffListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
