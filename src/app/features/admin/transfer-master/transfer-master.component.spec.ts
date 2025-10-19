import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferMasterComponent } from './transfer-master.component';

describe('TransferMasterComponent', () => {
  let component: TransferMasterComponent;
  let fixture: ComponentFixture<TransferMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransferMasterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransferMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
