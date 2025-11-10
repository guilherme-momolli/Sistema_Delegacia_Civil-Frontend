import { DelegaciaDTO } from "../../../service/usuario/usuario.service";
import { BemEnvolvimentoResponseDTO } from "../bem-envolvimento/bem-envolvimento-response.dto";
import { EnderecoResponseDTO } from "../endereco/endereco-response.dto";
import { PessoaEnvolvimentoResponseDTO } from "../pessoa-envolvimento/pessoa-envolvimento-response.dto";

export interface BoletimOcorrenciaResponseDTO {
  id: number;
  origemForcaPolicial: string;
  dataOcorrencia: string;
  boletim: string;
  natureza: string;
  representacao?: string;
  endereco?: EnderecoResponseDTO;
  delegaciaId: number;
  pessoasEnvolvidas?: PessoaEnvolvimentoResponseDTO[];
  bensEnvolvidos?: BemEnvolvimentoResponseDTO[];
}