import e from "express";

export enum SituacaoArmaFogo {
    CANCELADA = 'CANCELADA',
    IRREGULAR = 'IRREGULAR',
    REGISTRADA = 'REGISTRADA',
    REGULARIZADA = 'REGULARIZADA',
    SEM_REGISTRO = 'SEM_REGISTRO'
}

export const SituacaoArmaFogoDescricao: Record<SituacaoArmaFogo, string> = {
    [SituacaoArmaFogo.CANCELADA]: 'Cancelada',
    [SituacaoArmaFogo.IRREGULAR]: 'Irregular',
    [SituacaoArmaFogo.REGISTRADA]: 'Registrada',
    [SituacaoArmaFogo.REGULARIZADA]: 'Regularizada',
    [SituacaoArmaFogo.SEM_REGISTRO]: 'Sem registro'
}