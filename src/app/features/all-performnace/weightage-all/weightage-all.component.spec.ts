import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeightageAllComponent } from './weightage-all.component';

describe('WeightageAllComponent', () => {
  let component: WeightageAllComponent;
  let fixture: ComponentFixture<WeightageAllComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WeightageAllComponent]
    });
    fixture = TestBed.createComponent(WeightageAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
