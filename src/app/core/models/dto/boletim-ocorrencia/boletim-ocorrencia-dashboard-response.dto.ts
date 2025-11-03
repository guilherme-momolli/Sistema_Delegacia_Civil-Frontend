export interface BoletimOcorrenciaDashboardResponseDTO {
    totalBoletinsOcorrencia: number;
    totalPorOrigemForcaPolicial: Record<string, number>;    
}