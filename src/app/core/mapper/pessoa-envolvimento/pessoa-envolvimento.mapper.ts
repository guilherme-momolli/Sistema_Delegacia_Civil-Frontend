import { PessoaEnvolvimentoRequestDTO } from "../../models/dto/pessoa-envolvimento/pessoa-envolvimento-request.dto";
import { PessoaEnvolvimentoResponseDTO } from "../../models/dto/pessoa-envolvimento/pessoa-envolvimento-response.dto";

export class PessoaEnvolvimentoMapper {
  private constructor() {} 

  static toRequest(dto: PessoaEnvolvimentoResponseDTO): PessoaEnvolvimentoRequestDTO {
    return {
      id: dto.id,
      pessoaId: dto.pessoaId,
      boletimId: dto.boletimId,
      inqueritoId: dto.inqueritoId,
      tipoEnvolvimento: dto.tipoEnvolvimento,
      observacao: dto.observacao
    };
  }

  static toResponse(dto: PessoaEnvolvimentoRequestDTO): PessoaEnvolvimentoResponseDTO {
    return {
      id: dto.id ?? 0,
      pessoaId: dto.pessoaId,
      boletimId: dto.boletimId,
      inqueritoId: dto.inqueritoId,
      tipoEnvolvimento: dto.tipoEnvolvimento,
      observacao: dto.observacao
    };
  }

  static toRequestList(dtos: PessoaEnvolvimentoResponseDTO[]): PessoaEnvolvimentoRequestDTO[] {
    return dtos.map(this.toRequest);
  }

  static toResponseList(dtos: PessoaEnvolvimentoRequestDTO[]): PessoaEnvolvimentoResponseDTO[] {
    return dtos.map(this.toResponse);
  }
}