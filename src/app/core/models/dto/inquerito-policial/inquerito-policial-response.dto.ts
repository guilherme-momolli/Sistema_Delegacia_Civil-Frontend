import { PessoaEnvolvimentoResponseDTO } from "../pessoa-envolvimento/pessoa-envolvimento-response.dto";

export interface InqueritoPolicialResponseDTO {
  id: number;
  numeroJustica: string;
  ordemIp?: number;
  data: string;
  peca?: string;
  situacaoInquerito?: string;
  origemForcaPolicial?: string;
  naturezaDoDelito?: string;
  observacao?: string;
  delegaciaId: number;
  pessoasEnvolvidas?: PessoaEnvolvimentoResponseDTO[];
}