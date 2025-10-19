import { TestBed } from '@angular/core/testing';

import { HOPerformanceModule } from './hod_performance.module';

describe('PerformanceService', () => {
  let service: HOPerformanceModule;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HOPerformanceModule);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
