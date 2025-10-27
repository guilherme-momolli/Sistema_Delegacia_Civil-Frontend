export enum EspecieArmaFogo {

    ARMA_ARTESANAL= 'ARMA_ARTESANAL',
    ARMA_AIRSOFT = 'ARMA_AIRSOFT',
    ARMA_COMBINADA = 'ARMA_COMBINADA',
    ARMA_FOGO = 'ARMA_FOGO',
    ARMA_NAO_LETAL = 'ARMA_NAO_LETAL',
    ARMA_PRESSAO = 'ARMA_PRESSAO',
    ARMA_SIMULACRO = 'ARMA_SIMULACRO'

}

export const EspecieArmaFogoDescricao: Record<EspecieArmaFogo, string> = {
    [EspecieArmaFogo.ARMA_ARTESANAL]: 'Arma artesanal',
    [EspecieArmaFogo.ARMA_AIRSOFT]: 'Arma airsoft',
    [EspecieArmaFogo.ARMA_COMBINADA]: 'Arma combinada',
    [EspecieArmaFogo.ARMA_FOGO]: 'Arma de fogo',
    [EspecieArmaFogo.ARMA_NAO_LETAL]: 'Arma não letal',
    [EspecieArmaFogo.ARMA_PRESSAO]: 'Arma de pressão',
    [EspecieArmaFogo.ARMA_SIMULACRO]: 'Arma simulacro'
};