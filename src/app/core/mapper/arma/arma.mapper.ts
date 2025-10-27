import { ArmaRequestDTO } from "../../models/dto/arma/arma-request.dto";
import { ArmaResponseDTO } from "../../models/dto/arma/arma-response.dto";

export class ArmaMapper {

 static toRequestDTO(arma: any): ArmaRequestDTO {
    return {
      id: arma.id,
      bemId: arma.bemId,
      tipoArmaFogo: arma.tipoArmaFogo,
      especieArma: arma.especieArma,
      calibre: arma.calibre,
      numeroPorte: arma.numeroPorte,
      numeroSerie: arma.numeroSerie,
      numeroRegistro: arma.numeroRegistro,
      capacidade: arma.capacidade
    };
  }

  static toResponseModel(dto: ArmaResponseDTO): any {
    return {
      id: dto.id,
      calibre: dto.calibre,
      numeroSerie: dto.numeroSerie,
      numeroRegistro: dto.numeroRegistro,
      tipoArmaFogo: dto.tipoArmaFogo,
      especieArma: dto.especieArma,
      numeroPorte: dto.numeroPorte,
      capacidade: dto.capacidade,
      bemId: dto.bemId
    };
  }
}