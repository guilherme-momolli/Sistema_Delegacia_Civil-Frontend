import { PessoaEnvolvimentoRequestDTO } from "../pessoa-envolvimento/pessoa-envolvimento-request.dto";

export interface InqueritoPolicialRequestDTO {
  numeroJustica: string;
  ordemIp?: number;
  data: string; 
  peca?: string; 
  situacaoInquerito?: string; 
  origemForcaPolicial?: string; 
  naturezaDoDelito?: string;
  observacao?: string;
  delegaciaId: number;
  pessoasEnvolvidas?: PessoaEnvolvimentoRequestDTO[];
}