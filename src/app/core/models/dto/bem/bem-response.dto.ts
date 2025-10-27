import { ArmaResponseDTO } from "../arma/arma-response.dto";
import { DrogaResponseDTO } from "../droga/droga-response.dto";
import { ObjetoResponseDTO } from "../objeto/objeto-resonse.dto";
import { VeiculoResponseDTO } from "../veiculo/veiculo-response.dto";

export interface BemResponseDTO {
    
    id: number;
    tipoBem: string;
    imagemUrl: string;
    marca: string;
    modelo: string;
    valorEstimado: string;
    pessoaId: number;
    delegaciaId: number;
    instituicaoId: number;
    situacaoBem: string;
    origem: string;
    numeroLacre: string;
    localBem: string;
    observacao: string;
    descricao: string;
    createdAt: string;
    updatedAt: string;
    arma: ArmaResponseDTO;
    objeto: ObjetoResponseDTO;
    droga: DrogaResponseDTO;
    veiculo: VeiculoResponseDTO;
}