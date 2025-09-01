import { TestBed } from '@angular/core/testing';

import { ArmaService } from './arma.service';

describe('ArmaService', () => {
  let service: ArmaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArmaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
