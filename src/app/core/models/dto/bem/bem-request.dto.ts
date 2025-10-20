
export interface BemRequestDTO {
    
    id?: number;
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
}