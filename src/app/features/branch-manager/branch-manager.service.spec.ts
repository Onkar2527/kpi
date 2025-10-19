import { TestBed } from '@angular/core/testing';

import { BranchManagerService } from './branch-manager.service';

describe('BranchManagerService', () => {
  let service: BranchManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BranchManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
