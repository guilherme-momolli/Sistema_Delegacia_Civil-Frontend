export enum EspecieVeiculo {
    BLINDADO = 'BLINDADO',
    CARGA = 'CARGA',
    COLECAO = 'COLECAO',
    COMPETICAO = 'COMPETICAO',
    ESPECIAL = 'ESPECIAL',
    MISTO = 'MISTO',
    PASSAGEIRO = 'PASSAGEIRO',
    PASSEIO = 'PASSEIO',
    REBOQUE = 'REBOQUE',
    TRACAO = 'TRACAO',
}

export const EspecieVeiculoDescricao: Record<EspecieVeiculo, string> = {
    [EspecieVeiculo.BLINDADO]: 'Blindado',
    [EspecieVeiculo.CARGA]: 'Carga',
    [EspecieVeiculo.COLECAO]: 'Coleção',
    [EspecieVeiculo.COMPETICAO]: 'Competição',
    [EspecieVeiculo.ESPECIAL]: 'Especial',
    [EspecieVeiculo.MISTO]: 'Misto',
    [EspecieVeiculo.PASSAGEIRO]: 'Passageiro',
    [EspecieVeiculo.PASSEIO]: 'Passeio',
    [EspecieVeiculo.REBOQUE]: 'Reboque',
    [EspecieVeiculo.TRACAO]: 'Tração',
};