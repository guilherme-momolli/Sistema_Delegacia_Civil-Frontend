import { EnderecoRequestDTO } from "../../models/dto/endereco/endereco-request.dto";
import { EnderecoResponseDTO } from "../../models/dto/endereco/endereco-response.dto";

export class EnderecoMapper {
  private constructor() {} // impede instanciação

  static toRequest(dto: EnderecoResponseDTO): EnderecoRequestDTO {
    return {
      numero: dto.numero,
      logradouro: dto.logradouro,
      bairro: dto.bairro,
      municipio: dto.municipio,
      uf: dto.uf,
      pais: dto.pais,
      cep: dto.cep
    };
  }

  static toResponse(dto: EnderecoRequestDTO, id?: number, createdAt?: string, updatedAt?: string): EnderecoResponseDTO {
    return {
      id: id ?? 0,
      numero: dto.numero,
      logradouro: dto.logradouro,
      bairro: dto.bairro,
      municipio: dto.municipio,
      uf: dto.uf,
      pais: dto.pais,
      cep: dto.cep,
      createdAt,
      updatedAt
    };
  }

  static toRequestList(dtos: EnderecoResponseDTO[]): EnderecoRequestDTO[] {
    return dtos.map(this.toRequest);
  }

  static toResponseList(dtos: EnderecoRequestDTO[]): EnderecoResponseDTO[] {
    return dtos.map(dto => this.toResponse(dto));
  }
}
