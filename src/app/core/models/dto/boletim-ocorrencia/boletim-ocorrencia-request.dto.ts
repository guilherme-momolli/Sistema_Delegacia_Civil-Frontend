import { BemEnvolvimentoRequestDTO } from "../bem-envolvimento/bem-envolvimento-request.dto";
import { EnderecoRequestDTO } from "../endereco/endereco-request.dto";
import { PessoaEnvolvimentoRequestDTO } from "../pessoa-envolvimento/pessoa-envolvimento-request.dto";

export interface BoletimOcorrenciaRequestDTO {
  origemForcaPolicial: string;   
  dataOcorrencia: string;        
  boletim: string;
  natureza: string;
  representacao?: string;
  endereco?: EnderecoRequestDTO;
  delegaciaId: number;
  pessoasEnvolvidas?: PessoaEnvolvimentoRequestDTO[];
  bensEnvolvidos?: BemEnvolvimentoRequestDTO[];
}