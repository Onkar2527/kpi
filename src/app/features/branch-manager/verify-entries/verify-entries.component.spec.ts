import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyEntriesComponent } from './verify-entries.component';

describe('VerifyEntriesComponent', () => {
  let component: VerifyEntriesComponent;
  let fixture: ComponentFixture<VerifyEntriesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerifyEntriesComponent]
    });
    fixture = TestBed.createComponent(VerifyEntriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
