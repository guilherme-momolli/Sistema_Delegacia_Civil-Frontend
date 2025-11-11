import { NgModule } from '@angular/core';
import { CpfMaskPipe } from './pipes/cpf-mask.pipe';
import { CommonModule } from '@angular/common';
import { PesquisaPessoaComponent } from './components/pesquisa-pessoa/pesquisa-pessoa.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CpfMaskPipe,           // ← IMPORTA AQUI
    PesquisaPessoaComponent // ← SE TAMBÉM FOR STANDALONE
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CpfMaskPipe,           // ← EXPORTA AQUI
    PesquisaPessoaComponent
  ]
})
export class SharedModule {}