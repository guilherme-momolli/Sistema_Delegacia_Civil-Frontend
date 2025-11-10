import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PesquisaPessoaComponent } from './pesquisa-pessoa.component';

describe('PesquisaPessoaComponent', () => {
  let component: PesquisaPessoaComponent;
  let fixture: ComponentFixture<PesquisaPessoaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PesquisaPessoaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PesquisaPessoaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
