
export interface BemEnvolvimentoResponseDTO {
  id: number;
  bemId: number;
  boletimId?: number;
  inqueritoId?: number;
  tipoEnvolvimento: string;
  observacao?: string;
}