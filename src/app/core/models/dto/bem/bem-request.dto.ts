import { Arma } from "../../../service/arma/arma.service";
import { ArmaRequestDTO } from "../arma/arma-request.dto";
import { DrogaRequestDTO } from "../droga/droga-request.dto";
import { ObjetoRequestDTO } from "../objeto/objeto-request.dto";
import { VeiculoRequestDTO } from "../veiculo/veiculo-request.dto";

export interface BemRequestDTO {
    
    id?: number;
    tipoBem: string;
    imagemUrl: string;
    marca: string;
    modelo: string;
    valorEstimado: string;
    pessoaId: number;
    delegaciaId: number;
    situacaoBem: string;
    origem: string;
    numeroLacre: string;
    localBem: string;
    observacao: string;
    descricao: string;
    arma: ArmaRequestDTO;
    objeto: ObjetoRequestDTO;
    droga: DrogaRequestDTO;
    veiculo: VeiculoRequestDTO;
}