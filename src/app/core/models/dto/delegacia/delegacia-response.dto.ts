import { EnderecoResponseDTO } from "../endereco/endereco-response.dto";

export interface DelegaciaResponseDTO {
  id: number;
  imagemUrl?: string;
  nome: string;
  email?: string;
  secretaria: string;
  telefoneFixo?: string;
  telefoneCelular?: string;
  endereco?: EnderecoResponseDTO;
}