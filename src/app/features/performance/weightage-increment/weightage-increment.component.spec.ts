import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeightageIncrementComponent } from './weightage-increment.component';

describe('WeightageIncrementComponent', () => {
  let component: WeightageIncrementComponent;
  let fixture: ComponentFixture<WeightageIncrementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WeightageIncrementComponent]
    });
    fixture = TestBed.createComponent(WeightageIncrementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
