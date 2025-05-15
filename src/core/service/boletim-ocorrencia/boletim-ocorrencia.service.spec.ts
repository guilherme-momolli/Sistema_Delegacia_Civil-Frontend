import { TestBed } from '@angular/core/testing';

import { BoletimOcorrenciaService } from './boletim-ocorrencia.service';

describe('BoletimOcorrenciaService', () => {
  let service: BoletimOcorrenciaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BoletimOcorrenciaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
