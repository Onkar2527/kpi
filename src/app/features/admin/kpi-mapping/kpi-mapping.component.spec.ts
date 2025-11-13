import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiMappingComponent } from './kpi-mapping.component';

describe('KpiMappingComponent', () => {
  let component: KpiMappingComponent;
  let fixture: ComponentFixture<KpiMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiMappingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(KpiMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
