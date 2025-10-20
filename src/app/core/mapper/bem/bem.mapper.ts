import { BemRequestDTO } from "../../models/dto/bem/bem-request.dto";
import { BemResponseDTO } from "../../models/dto/bem/bem-response.dto";

export class BemMapper {

  static toRequest(form: any): BemRequestDTO {
    return {    
        id: form.id ? Number(form.id) : undefined,
        tipoBem: form.tipoBem || '',
        imagemUrl: form.imagemUrl || '',
        marca: form.marca || '',
        modelo: form.modelo || '',
        valorEstimado: form.valorEstimado || '',
        pessoaId: form.pessoaId ? Number(form.pessoaId) : 0,
        delegaciaId: form.delegaciaId ? Number(form.delegaciaId) : 0,
        instituicaoId: form.instituicaoId ? Number(form.instituicaoId) : 0,
        situacaoBem: form.situacaoBem || '',
        origem: form.origem || '',
        numeroLacre: form.numeroLacre || '',
        localBem: form.localBem || '',
        observacao: form.observacao || '',
        descricao: form.descricao || ''
    };
  }

  static fromResponse(dto: BemResponseDTO): any {
    return {
      id: dto.id,
      tipoBem: dto.tipoBem,
      imagemUrl: dto.imagemUrl,
      marca: dto.marca,
      modelo: dto.modelo,
      valorEstimado: dto.valorEstimado,
      pessoaId: dto.pessoaId,
      delegaciaId: dto.delegaciaId,
      instituicaoId: dto.instituicaoId,
      situacaoBem: dto.situacaoBem,
      origem: dto.origem,
      numeroLacre: dto.numeroLacre,
      localBem: dto.localBem,
      observacao: dto.observacao,
      descricao: dto.descricao,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt
    };
  }

  static fromResponseList(dtos: BemResponseDTO[]): any[] {
    return dtos.map(dto => this.fromResponse(dto));
  }
}