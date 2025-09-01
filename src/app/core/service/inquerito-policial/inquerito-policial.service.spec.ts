import { TestBed } from '@angular/core/testing';

import { InqueritoPolicialService } from './inquerito-policial.service';

describe('InqueritoPolicialService', () => {
  let service: InqueritoPolicialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InqueritoPolicialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
