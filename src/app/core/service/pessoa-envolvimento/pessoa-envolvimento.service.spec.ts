import { TestBed } from '@angular/core/testing';

import { PessoaEnvolvimentoService } from './pessoa-envolvimento.service';

describe('PessoaEnvolvimentoService', () => {
  let service: PessoaEnvolvimentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PessoaEnvolvimentoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
