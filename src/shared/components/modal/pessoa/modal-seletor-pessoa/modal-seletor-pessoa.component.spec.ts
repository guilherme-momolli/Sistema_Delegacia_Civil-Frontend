import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSeletorPessoaComponent } from './modal-seletor-pessoa.component';

describe('ModalSeletorPessoaComponent', () => {
  let component: ModalSeletorPessoaComponent;
  let fixture: ComponentFixture<ModalSeletorPessoaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalSeletorPessoaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalSeletorPessoaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
