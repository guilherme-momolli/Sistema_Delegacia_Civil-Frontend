
export interface PessoaEnvolvimentoRequestDTO {
  id?: number;
  pessoaId: number;
  boletimId?: number;
  inqueritoId?: number;
  tipoEnvolvimento: string;
  observacao?: string;
}