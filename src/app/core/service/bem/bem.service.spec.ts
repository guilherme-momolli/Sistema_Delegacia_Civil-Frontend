import { TestBed } from '@angular/core/testing';

import { BemService } from './bem.service';

describe('BemService', () => {
  let service: BemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
