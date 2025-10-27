import e from "express";

export enum TipoTracao {
    
    DIANTEIRA = 'DIANTEIRA',
    TRASEIRA = 'TRASEIRA',
    INTEGRAL_4X4 = 'INTEGRAL_4X4',
    PERMANENTE_AWD = 'PERMANENTE_AWD',
    REDUZIDA = 'REDUZIDA',
    MISTA = 'MISTA',
    NAO_APLICAVEL = 'NAO_APLICAVEL'

}

export const TipoTracaoDescricao: Record<TipoTracao, string> = {
    [TipoTracao.DIANTEIRA]: 'Dianteira',
    [TipoTracao.TRASEIRA]: 'Traseira',
    [TipoTracao.INTEGRAL_4X4]: 'Integral 4x4',
    [TipoTracao.PERMANENTE_AWD]: 'Permanente AWD',
    [TipoTracao.REDUZIDA]: 'Reduzida',
    [TipoTracao.MISTA]: 'Mista',
    [TipoTracao.NAO_APLICAVEL]: 'Não aplicável'
};