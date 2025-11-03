export interface ArmaDashboardResponseDTO {
    totalPorCalibre: Record<string, number>;
    totalPorEspecieArma: Record<string, number>;
    totalPorSituacaoArmaFogo: Record<string, number>;
    totalPorTipoArmaFogo: Record<string, number>;
}