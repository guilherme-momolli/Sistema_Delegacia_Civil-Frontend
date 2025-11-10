import { PessoaEnvolvimentoRequestDTO } from "../../models/dto/pessoa-envolvimento/pessoa-envolvimento-request.dto";
import { PessoaEnvolvimentoResponseDTO } from "../../models/dto/pessoa-envolvimento/pessoa-envolvimento-response.dto";

export class PessoaEnvolvimentoMapper {

  static toRequest(formValue: any, inqueritoId?: number, boletimId?: number): PessoaEnvolvimentoRequestDTO {
    return {
      id: formValue.id || undefined,
      pessoaId: formValue.pessoaId,
      tipoEnvolvimento: formValue.tipoEnvolvimento,
      observacao: formValue.observacao || undefined,
      inqueritoId,
      boletimId
    };
  }

  static toFormModel(dto: PessoaEnvolvimentoResponseDTO) {
    return {
      id: dto.id,
      pessoaId: dto.pessoaId,
      tipoEnvolvimento: dto.tipoEnvolvimento,
      observacao: dto.observacao ?? ''
    };
  }

  static toResponse(entity: any): PessoaEnvolvimentoResponseDTO {
    return {
      id: entity.id,
      pessoaId: entity.pessoaId,
      boletimId: entity.boletimId,
      inqueritoId: entity.inqueritoId,
      tipoEnvolvimento: entity.tipoEnvolvimento,
      observacao: entity.observacao
    };
  }
}