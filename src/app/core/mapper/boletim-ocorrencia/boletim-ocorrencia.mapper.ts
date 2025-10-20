import { BoletimOcorrenciaRequestDTO } from "../../models/dto/boletim-ocorrencia/boletim-ocorrencia-request.dto";
import { BoletimOcorrenciaResponseDTO } from "../../models/dto/boletim-ocorrencia/boletim-ocorrencia-response.dto";
import { EnderecoMapper } from "../endereco/endereco.mapper";
import { PessoaEnvolvimentoMapper } from "../pessoa-envolvimento/pessoa-envolvimento.mapper";

export class BoletimOcorrenciaMapper {
  private constructor() {}

  static formToRequest(formValue: any): BoletimOcorrenciaRequestDTO {
    return {
      origemForcaPolicial: formValue.origemForcaPolicial,
      dataOcorrencia: formValue.dataOcorrencia,
      boletim: formValue.boletim,
      natureza: formValue.natureza,
      representacao: formValue.representacao,
      delegaciaId: formValue.delegaciaId,
      endereco: formValue.enderecoForm,
      pessoasEnvolvidas: (formValue.pessoasEnvolvidasIds || []).map((p: any) => ({
        pessoaId: p.id,
        tipoEnvolvimento: p.tipoEnvolvimento,
        observacao: p.observacao
      }))
    };
  }

  static toResponse(dto: any): BoletimOcorrenciaResponseDTO {
    return {
      id: dto.id,
      origemForcaPolicial: dto.origemForcaPolicial,
      dataOcorrencia: dto.dataOcorrencia,
      boletim: dto.boletim,
      natureza: dto.natureza,
      representacao: dto.representacao,
      delegaciaId: dto.delegaciaId,
      endereco: dto.endereco ? EnderecoMapper.toResponse(dto.endereco) : undefined,
      pessoasEnvolvidas: (dto.pessoasEnvolvidas || []).map((p: any) => PessoaEnvolvimentoMapper.toResponse(p))
    };
  }
}
