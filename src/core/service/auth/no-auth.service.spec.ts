import { TestBed } from '@angular/core/testing';

import { NoAuthService } from './no-auth.service';

describe('NoAuthService', () => {
  let service: NoAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NoAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
