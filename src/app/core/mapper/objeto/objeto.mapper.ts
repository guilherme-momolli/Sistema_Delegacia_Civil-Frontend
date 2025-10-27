import { ObjetoRequestDTO } from "../../models/dto/objeto/objeto-request.dto";
import { ObjetoResponseDTO } from "../../models/dto/objeto/objeto-resonse.dto";

export class ObjetoMapper {

    
  static toRequestDTO(objeto: any): ObjetoRequestDTO {
    return {
      id: objeto.id,
      bemId: objeto.bemId,
      tipoObjeto: objeto.tipoObjeto,
      numeroSerie: objeto.numeroSerie,
      cor: objeto.cor,
      material: objeto.material,
      dimensoes: objeto.dimensoes,
      estadoConservacao: objeto.estadoConservacao,
      situacaoObjeto: objeto.situacaoObjeto
    };
  }

  static toResponseModel(dto: ObjetoResponseDTO): any {
    return {
      id: dto.id,
      bemId: dto.bemId,
      tipoObjeto: dto.tipoObjeto,
      numeroSerie: dto.numeroSerie,
      cor: dto.cor,
      material: dto.material,
      dimensoes: dto.dimensoes,
      estadoConservacao: dto.estadoConservacao,
      situacaoObjeto: dto.situacaoObjeto,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt
    };
  }
}