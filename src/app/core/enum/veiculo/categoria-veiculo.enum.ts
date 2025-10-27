export enum CategoriaVeiculo {
    ALUGUEL = 'ALUGUEL',
    APRENDIZAGEM = 'APRENDIZAGEM',
    CARGA = 'CARGA',
    COLECIONADOR = 'COLECIONADOR',
    COMERCIAL = 'COMERCIAL',
    DIPLOMATICO = 'DIPLOMATICO',
    EXPERIENCIA = 'EXPERIENCIA',
    MISSAO  = 'MISSAO',
    OFICIAL = 'OFICIAL',
    PARTICULAR = 'PARTICULAR'
}

export const CategoriaVeiculoDescricao: Record<CategoriaVeiculo, string> = {
    [CategoriaVeiculo.ALUGUEL]: 'Aluguel',
    [CategoriaVeiculo.APRENDIZAGEM]: 'Aprendizagem',
    [CategoriaVeiculo.CARGA]: 'Carga',
    [CategoriaVeiculo.COLECIONADOR]: 'Colecionador',
    [CategoriaVeiculo.COMERCIAL]: 'Comercial',
    [CategoriaVeiculo.DIPLOMATICO]: 'Diplomático',
    [CategoriaVeiculo.EXPERIENCIA]: 'Experiência',
    [CategoriaVeiculo.MISSAO]: 'Missão',
    [CategoriaVeiculo.OFICIAL]: 'Oficial',
    [CategoriaVeiculo.PARTICULAR]: 'Particular'
};      