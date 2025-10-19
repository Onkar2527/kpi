import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyTargetsComponent } from './my-targets.component';

describe('MyTargetsComponent', () => {
  let component: MyTargetsComponent;
  let fixture: ComponentFixture<MyTargetsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyTargetsComponent]
    });
    fixture = TestBed.createComponent(MyTargetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
