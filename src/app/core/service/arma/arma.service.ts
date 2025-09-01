import { Injectable } from '@angular/core';

export interface Arma {
  id: number;
  tipoArmaFogo: string;
  especie: string;
  marca: string;
  calibre: string;
  numeroPorte: string;
  numeroSerie: string;
  numeroRegistro: string;
  capacidade: number;
  quantidade: string;
  numeroLacre: string;
  valor: number;
  localArma: number;
  situacaoArma: string;
}

@Injectable({
  providedIn: 'root'
})
export class ArmaService {

  constructor() { }
}
