export interface InqueritoPolicialDashboardResponseDTO {
    totalInqueritosPoliciais: number;
    totalPorSituacaoInquerito: Record<string, number>;
    totalPorOrigemForcaPolicial: Record<string, number>;  
}