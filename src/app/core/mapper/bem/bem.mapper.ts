import { BemRequestDTO } from "../../models/dto/bem/bem-request.dto";
import { BemResponseDTO } from "../../models/dto/bem/bem-response.dto";
import { ArmaMapper } from "../arma/arma.mapper";
import { DrogaMapper } from "../droga/droga.mapper";
import { ObjetoMapper } from "../objeto/objeto.mapper";
import { VeiculoMapper } from "../veiculo/veiculo.mapper";

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
      situacaoBem: form.situacaoBem || '',
      origem: form.origem || '',
      numeroLacre: form.numeroLacre || '',
      localBem: form.localBem || '',
      observacao: form.observacao || '',
      descricao: form.descricao || '',

      arma: form.arma ? ArmaMapper.toRequestDTO(form.arma) : {} as any,
      droga: form.droga ? DrogaMapper.toRequestDTO(form.droga) : {} as any,
      objeto: form.objeto ? ObjetoMapper.toRequestDTO(form.objeto) : {} as any,
      veiculo: form.veiculo ? VeiculoMapper.toRequestDTO(form.veiculo) : {} as any
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
      situacaoBem: dto.situacaoBem,
      origem: dto.origem,
      numeroLacre: dto.numeroLacre,
      localBem: dto.localBem,
      observacao: dto.observacao,
      descricao: dto.descricao,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
      arma: dto.arma ? ArmaMapper.toResponseModel(dto.arma) : null,
      droga: dto.droga ? DrogaMapper.toResponseModel(dto.droga) : null,
      objeto: dto.objeto ? ObjetoMapper.toResponseModel(dto.objeto) : null,
      veiculo: dto.veiculo ? VeiculoMapper.toResponseModel(dto.veiculo) : null,
    };
  }

  static fromResponseList(dtos: BemResponseDTO[]): any[] {
    return dtos.map(dto => this.fromResponse(dto));
  }
}