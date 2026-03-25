import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HOStaffListComponent } from './ho-staff-list.component';

describe('HOStaffListComponent', () => {
  let component: HOStaffListComponent;
  let fixture: ComponentFixture<HOStaffListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HOStaffListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HOStaffListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
