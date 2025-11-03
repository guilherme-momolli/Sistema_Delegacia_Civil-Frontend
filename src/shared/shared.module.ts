import { NgModule } from '@angular/core';
import { CpfMaskPipe } from './pipes/cpf-mask.pipe';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    CpfMaskPipe 
  ]
})
export class SharedModule {}