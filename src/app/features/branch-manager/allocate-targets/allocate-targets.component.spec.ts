import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocateTargetsComponent } from './allocate-targets.component';

describe('AllocateTargetsComponent', () => {
  let component: AllocateTargetsComponent;
  let fixture: ComponentFixture<AllocateTargetsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllocateTargetsComponent]
    });
    fixture = TestBed.createComponent(AllocateTargetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
