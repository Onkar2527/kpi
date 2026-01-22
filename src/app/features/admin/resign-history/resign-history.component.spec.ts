import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResignHistoryComponent } from './resign-history.component';

describe('TransferMasterComponent', () => {
  let component: ResignHistoryComponent;
  let fixture: ComponentFixture<ResignHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResignHistoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResignHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
