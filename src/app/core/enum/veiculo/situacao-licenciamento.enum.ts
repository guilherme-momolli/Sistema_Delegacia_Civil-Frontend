export enum SituacaoLicenciamento {

    ATRASADO = 'ATRASADO',
    BLOQUEADO = 'BLOQUEADO',
    REGULAR = 'REGULAR',
}

export const SituacaoLicenciamentoDescricao: Record<SituacaoLicenciamento, string> = {
    [SituacaoLicenciamento.ATRASADO]: 'Atrasado',
    [SituacaoLicenciamento.BLOQUEADO]: 'Bloqueado',
    [SituacaoLicenciamento.REGULAR]: 'Regular',
};