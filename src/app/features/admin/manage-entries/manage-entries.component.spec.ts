import { ComponentFixture, TestBed } from '@angular/core/testing';

import { manageEntriesComponent } from './manage-entries.component';

describe('manageEntriesComponent', () => {
  let component: manageEntriesComponent;
  let fixture: ComponentFixture<manageEntriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [manageEntriesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(manageEntriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
