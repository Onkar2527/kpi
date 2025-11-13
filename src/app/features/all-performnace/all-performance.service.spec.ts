import { TestBed } from '@angular/core/testing';

import { AllPerformanceModule } from './all-performance.module';

describe('PerformanceService', () => {
  let service: AllPerformanceModule;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AllPerformanceModule);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
