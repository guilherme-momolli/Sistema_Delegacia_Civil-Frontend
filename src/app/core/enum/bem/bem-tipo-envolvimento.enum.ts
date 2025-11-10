export enum BemTipoEnvolvimento {
     
    GARANTIA_PATRIMONIAL_CAUTELAR = 'GARANTIA_PATRIMONIAL_CAUTELAR',
    INSTRUMENTO_DO_CRIME = 'INSTRUMENTO_DO_CRIME',
    INTERESSE_A_PROVA = 'INTERESSE_A_PROVA',
    OBJETO_DE_SUBTRACAO = 'OBJETO_DE_SUBTRACAO'
}

export const BemTipoEnvolvimentoDescricao: Record<BemTipoEnvolvimento, string> = {
    [BemTipoEnvolvimento.GARANTIA_PATRIMONIAL_CAUTELAR]: 'Garantia patrimonial cautelar',
    [BemTipoEnvolvimento.INSTRUMENTO_DO_CRIME]: 'Instrumento do crime',
    [BemTipoEnvolvimento.INTERESSE_A_PROVA]: 'Interesse à prova',
    [BemTipoEnvolvimento.OBJETO_DE_SUBTRACAO]: 'Objeto de subtração'
};