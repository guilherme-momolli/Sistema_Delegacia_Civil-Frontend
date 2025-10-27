import { DrogaRequestDTO } from "../../models/dto/droga/droga-request.dto";
import { DrogaResponseDTO } from "../../models/dto/droga/droga-response.dto";

export class DrogaMapper {

  static toRequestDTO(droga: any): DrogaRequestDTO {
    return {
      id: droga.id,
      bemId: droga.bemId,
      tipoDroga: droga.tipoDroga,
      quantidade: droga.quantidade,
      unidadeMedida: droga.unidadeMedida,
      situacaoDroga: droga.situacaoDroga,
    };
  }

  static toResponseModel(dto: DrogaResponseDTO): any {
    return {
      id: dto.id,
      bemId: dto.bemId,
      tipoDroga: dto.tipoDroga,
      quantidade: dto.quantidade,
      unidadeMedida: dto.unidadeMedida,
      situacaoDroga: dto.situacaoDroga,
    };
  }
}