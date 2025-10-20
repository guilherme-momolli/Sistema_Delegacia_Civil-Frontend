import { PessoaEnvolvimentoRequestDTO } from "../pessoa-envolvimento/pessoa-envolvimento-request.dto";

export interface InqueritoPolicialRequestDTO {
  id?: number;
  numeroJustica: string;
  ordemIp?: number;
  data: string; // ISO string: "2025-09-18"
  peca?: string; // ou criar enum Peca
  situacaoInquerito?: string; // ou enum SituacaoInquerito
  origemForcaPolicial?: string; // enum OrigemForcaPolicial
  naturezaDoDelito?: string;
  observacao?: string;
  delegaciaId: number;
  pessoasEnvolvidas?: PessoaEnvolvimentoRequestDTO[];
}