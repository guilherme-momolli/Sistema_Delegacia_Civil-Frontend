import { EnderecoRequestDTO } from "../endereco/endereco-request.dto";

export interface DelegaciaRequestDTO {
  nome: string;
  email?: string;
  secretaria: string;
  telefoneFixo?: string;
  telefoneCelular?: string;
  imagemUrl?: string;
  endereco?: EnderecoRequestDTO;
  senha?: string;
}