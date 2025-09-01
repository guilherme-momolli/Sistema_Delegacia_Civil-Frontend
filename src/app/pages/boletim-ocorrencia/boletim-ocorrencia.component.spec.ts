import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoletimOcorrenciaComponent } from './boletim-ocorrencia.component';

describe('BoletimOcorrenciaComponent', () => {
  let component: BoletimOcorrenciaComponent;
  let fixture: ComponentFixture<BoletimOcorrenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoletimOcorrenciaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoletimOcorrenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
