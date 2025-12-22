import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttenderKpisComponent } from './attender-kpis.component';

describe('AttenderKpisComponent', () => {
  let component: AttenderKpisComponent;
  let fixture: ComponentFixture<AttenderKpisComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AttenderKpisComponent]
    });
    fixture = TestBed.createComponent(AttenderKpisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
