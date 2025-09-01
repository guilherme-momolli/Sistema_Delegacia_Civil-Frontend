import { Injectable } from '@angular/core';
export interface Droga {
  id: number;
  tipoDroga: string;
  nomePopular: string;
  unidadeMedida: string;
  quantidade: number;
  quantidadePericia: number;
  quantidadePorExtenso: string;
  observacao: string;
  numeroLacre: number;
  localDroga: string;
  situacaoDroga: string;
  inqueritoPolicialId: number;
}
@Injectable({
  providedIn: 'root'
})



export class DrogaService {

  constructor() { }
}
