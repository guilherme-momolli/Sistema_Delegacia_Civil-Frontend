import { ArmaDashboardResponseDTO } from "../arma/arma-dashboard-response.dto";
import { DrogaDashboardResponseDTO } from "../droga/droga-dashboard-response.dto";
import { VeiculoDashboardResponseDTO } from "../veiculo/veiculo-dashboard-response.dto";

export interface BemDashboardResponseDTO {
    totalBens: number;
    totalPorTipoBem: Record<string, number>;
    totalPorSituacaoBem: Record<string, number>;
    armaDashboardResponse: ArmaDashboardResponseDTO;
    drogaDashboardResponse: DrogaDashboardResponseDTO;
    veiculoDashboardResponse: VeiculoDashboardResponseDTO;
}