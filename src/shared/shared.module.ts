import { NgModule } from '@angular/core';
import { CpfMaskPipe } from './pipes/cpf-mask.pipe';
import { CommonModule } from '@angular/common';
import { PesquisaPessoaComponent } from './components/pesquisa-pessoa/pesquisa-pessoa.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [],
  imports: [
    PesquisaPessoaComponent,
    CommonModule,
    CpfMaskPipe,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class SharedModule {}