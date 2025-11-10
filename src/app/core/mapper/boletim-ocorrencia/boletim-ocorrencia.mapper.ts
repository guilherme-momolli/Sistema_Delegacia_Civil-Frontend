import { BoletimOcorrenciaRequestDTO } from "../../models/dto/boletim-ocorrencia/boletim-ocorrencia-request.dto";
import { BoletimOcorrenciaResponseDTO } from "../../models/dto/boletim-ocorrencia/boletim-ocorrencia-response.dto";
import { EnderecoMapper } from "../endereco/endereco.mapper";
import { PessoaEnvolvimentoMapper } from "../pessoa-envolvimento/pessoa-envolvimento.mapper";
import { BemEnvolvimentoMapper } from "../bem-envolvimento/bem-envolvimento.mapper";

export class BoletimOcorrenciaMapper {
  private constructor() {}


  static toRequest(formValue: any): BoletimOcorrenciaRequestDTO {
    const boletimId = formValue.id;

    return {
      origemForcaPolicial: formValue.origemForcaPolicial,
      dataOcorrencia: formValue.dataOcorrencia,
      boletim: formValue.boletim,
      natureza: formValue.natureza,
      representacao: formValue.representacao,
      delegaciaId: formValue.delegaciaId,
      endereco: formValue.endereco ? {
        ...formValue.endereco,
        numero: formValue.endereco.numero ? Number(formValue.endereco.numero) : undefined,
        cep: formValue.endereco.cep || undefined
      } : undefined,


      pessoasEnvolvidas: (formValue.pessoasEnvolvidas || []).map((p: any) =>
        PessoaEnvolvimentoMapper.toRequest(p, boletimId)
      ),

      bensEnvolvidos: (formValue.bensEnvolvidos || []).map((b: any) =>
        BemEnvolvimentoMapper.toRequest(b, boletimId)
      )
    };
  }

  // === DTO → RESPONSE (para exibir) ===
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

      // === PESSOAS ===
      pessoasEnvolvidas: (dto.pessoasEnvolvidas || []).map((p: any) =>
        PessoaEnvolvimentoMapper.toResponse(p)
      ),

      // === BENS ===
      bensEnvolvidos: (dto.bensEnvolvidos || []).map((b: any) =>
        BemEnvolvimentoMapper.toResponse(b)
      )
    };
  }

  // === DTO → FORM MODEL (para edição) ===
  static toFormModel(dto: BoletimOcorrenciaResponseDTO): any {
    return {
      id: dto.id,
      origemForcaPolicial: dto.origemForcaPolicial,
      dataOcorrencia: dto.dataOcorrencia,
      boletim: dto.boletim,
      natureza: dto.natureza,
      representacao: dto.representacao,
      delegaciaId: dto.delegaciaId,

      endereco: {
        pais: dto.endereco?.pais || 'BRASIL',
        uf: dto.endereco?.uf || '',
        municipio: dto.endereco?.municipio || '',
        bairro: dto.endereco?.bairro || '',
        logradouro: dto.endereco?.logradouro || '',
        numero: dto.endereco?.numero || '',
        cep: dto.endereco?.cep || ''
      },

      // === PESSOAS ===
      pessoasEnvolvidas: (dto.pessoasEnvolvidas || []).map(p => ({
        pessoaId: p.pessoaId,
        tipoEnvolvimento: p.tipoEnvolvimento,
        observacao: p.observacao || ''
      })),

      // === BENS ===
      bensEnvolvidos: (dto.bensEnvolvidos || []).map(b => ({
        bemId: b.bemId,
        tipoEnvolvimento: b.tipoEnvolvimento,
        observacao: b.observacao || ''
      }))
    };
  }
}