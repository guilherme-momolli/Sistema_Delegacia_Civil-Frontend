import { Injectable } from '@angular/core';

export interface BoletimOcorrencia{
  id: number,
  ordem: number,
  data: string,
  boletim: string,
  relacionadoVinculado: string,
  natureza: string,
  autor: string,
  vitima: string,
  representacao: string,
  objeto: string,
  outros: string,
  camera: string,
  celular: string,
  municao: string,
  veiculo: string,
  sitacaoApreencoes: string,
  procedimento: string,
  numero: number,
  gabinete: string,
  carotrioCentral: string,
  
}

@Injectable({
  providedIn: 'root'
})
export class ArmaService {

  constructor() { }
}
