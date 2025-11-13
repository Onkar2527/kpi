import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiMasterComponent } from './kpi-master.component';

describe('KpiMasterComponent', () => {
  let component: KpiMasterComponent;
  let fixture: ComponentFixture<KpiMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiMasterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(KpiMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
