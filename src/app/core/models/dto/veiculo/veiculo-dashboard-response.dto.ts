export interface VeiculoDashboardResponseDTO {
    totalPorCambio: Record<string, number>;
    totalPorCarroceria: Record<string, number>;
    totalPorCategoriaVeiculo: Record<string, number>;
    totalPorCombustivel: Record<string, number>;
    totalPorEspecieVeiculo: Record<string, number>;
    totalPorSituacaoLicenciamento: Record<string, number>;
    totalPorSituacaoVeiculo: Record<string, number>;
    totalPorTipoTracao: Record<string, number>;
    totalPorTipoVeiculo: Record<string, number>;
}