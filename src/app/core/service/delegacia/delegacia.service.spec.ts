import { TestBed } from '@angular/core/testing';

import { DelegaciaService } from './delegacia.service';

describe('DelegaciaService', () => {
  let service: DelegaciaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DelegaciaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
