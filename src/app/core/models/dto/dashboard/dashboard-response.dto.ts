import { BemDashboardResponseDTO } from "../bem/bem-dashboard-response.dto";
import { BoletimOcorrenciaDashboardResponseDTO } from "../boletim-ocorrencia/boletim-ocorrencia-dashboard-response.dto";
import { InqueritoPolicialDashboardResponseDTO } from "../inquerito-policial/inquerito-policial-dashboard-response.dto";
import { PessoaDashboardResponseDTO } from "../pessoa/pessoa-dashboard-response.dto";

export interface DashboardResponseDTO{
    inqueritoPolicialDashboardResponse: InqueritoPolicialDashboardResponseDTO;
    boletimOcorrenciaDashboardResponse: BoletimOcorrenciaDashboardResponseDTO;
    bemDashboardResponse: BemDashboardResponseDTO;
    pessoaDashboardResponse: PessoaDashboardResponseDTO;
}