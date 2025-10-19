import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadTargetsComponent } from './upload-targets.component';

describe('UploadTargetsComponent', () => {
  let component: UploadTargetsComponent;
  let fixture: ComponentFixture<UploadTargetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadTargetsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UploadTargetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
