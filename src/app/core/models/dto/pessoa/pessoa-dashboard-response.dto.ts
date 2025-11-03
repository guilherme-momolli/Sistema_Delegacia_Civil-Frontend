export interface PessoaDashboardResponseDTO {
    totalPessoas: number;
    totalPorGenero: Record<string, number>;
    totalPorEtnia: Record<string, number>;
    totalPorEstadoCivil: Record<string, number>;
    totalPorSituacaoPessoa: Record<string, number>;
}