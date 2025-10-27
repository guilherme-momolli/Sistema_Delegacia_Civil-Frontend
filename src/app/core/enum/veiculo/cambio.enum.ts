export enum Cambio{

    MANUAL = 'MANUAL',
    AUTOMATICO = 'AUTOMATICO',
    CVT = 'CVT',
    DUPLA_EMBREAGEM = 'DUPLA_EMBREAGEM',
    AUTOMATIZADO = 'AUTOMATIZADO'
}

export const CambioDescricao: Record<Cambio, string> = {
    [Cambio.MANUAL]: 'Manual',
    [Cambio.AUTOMATICO]: 'Automático',
    [Cambio.CVT]: 'Transmissão Continuamente Variável- CVT',
    [Cambio.DUPLA_EMBREAGEM]: 'Dupla Embreagem',
    [Cambio.AUTOMATIZADO]: 'Automatizado'
};