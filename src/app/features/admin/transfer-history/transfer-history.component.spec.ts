import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrasferHistoryComponent } from './transfer-history.component';

describe('TransferMasterComponent', () => {
  let component: TrasferHistoryComponent;
  let fixture: ComponentFixture<TrasferHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrasferHistoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TrasferHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
