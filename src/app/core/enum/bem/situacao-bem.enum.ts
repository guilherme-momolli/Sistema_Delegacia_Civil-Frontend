export enum SituacaoBem {
    APREENDIDO = 'APREENDIDO',
    DEVOLVIDO = 'DEVOLVIDO',
    DANIFICADO = 'DANIFICADO',
    DESTRUIDO = 'DESTRUIDO',
    EXTRAVIADO = 'EXTRAVIADO',
    PERDA_TOTAL = 'PERDA_TOTAL',
    ROUBADO = 'ROUBADO',
}

export const SituacaoBemDescricao: Record<SituacaoBem, string> = {
    [SituacaoBem.APREENDIDO]: 'Apreendido',
    [SituacaoBem.DEVOLVIDO]: 'Devolvido',
    [SituacaoBem.DANIFICADO]: 'Danificado',
    [SituacaoBem.DESTRUIDO]: 'Destruído',
    [SituacaoBem.EXTRAVIADO]: 'Extraviado',
    [SituacaoBem.PERDA_TOTAL]: 'Perda total',
    [SituacaoBem.ROUBADO]: 'Roubado',
};