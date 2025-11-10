import { BemEnvolvimentoRequestDTO } from "../../models/dto/bem-envolvimento/bem-envolvimento-request.dto";
import { BemEnvolvimentoResponseDTO } from "../../models/dto/bem-envolvimento/bem-envolvimento-response.dto";

export class BemEnvolvimentoMapper {

  static toRequest(formValue: any, inqueritoId?: number, boletimId?: number): BemEnvolvimentoRequestDTO {
    return {
      id: formValue.id || undefined,
      bemId: formValue.bemId,
      tipoEnvolvimento: formValue.tipoEnvolvimento,
      observacao: formValue.observacao || undefined,
      inqueritoId,
      boletimId
    };
  }

  static toResponse(entity: any): BemEnvolvimentoResponseDTO {
  return {
    id: entity.id,
    bemId: entity.bem?.id,
    boletimId: entity.boletimId,
    inqueritoId: entity.inqueritoId,
    tipoEnvolvimento: entity.tipoEnvolvimento,
    observacao: entity.observacao
  };
}

  static toFormModel(dto: BemEnvolvimentoResponseDTO) {
    return {
      id: dto.id,
      bemId: dto.bemId,
      tipoEnvolvimento: dto.tipoEnvolvimento,
      observacao: dto.observacao
    };
  }
}