import { EnderecoRequestDTO } from "../../models/dto/endereco/endereco-request.dto";
import { PessoaRequestDTO } from "../../models/dto/pessoa/pessoa-request.dto";
import { PessoaResponseDTO } from "../../models/dto/pessoa/pessoa-response.dto";
import { EnderecoMapper } from "../endereco/endereco.mapper";

export class PessoaMapper {

  static toRequest(dto: PessoaResponseDTO): PessoaRequestDTO {
    if (!dto) return {} as PessoaRequestDTO;

    return {
      imagemUrl: dto.imagemUrl,
      nome: dto.nome,
      nomeSocial: dto.nomeSocial,
      cpf: dto.cpf,
      rg: dto.rg,
      dataNascimento: dto.dataNascimento,
      sexo: dto.sexo,
      telefoneCelular: dto.telefoneCelular,
      telefoneFixo: dto.telefoneFixo,
      email: dto.email,
      certificadoRegistro: dto.certificadoRegistro,
      situacaoPessoa: dto.situacaoPessoa,
      nacionalidade: dto.nacionalidade,
      naturalidade: dto.naturalidade,
      estadoCivil: dto.estadoCivil,
      profissao: dto.profissao,
      etnia: dto.etnia,
      descricao: dto.descricao,
      endereco: dto.endereco ? EnderecoMapper.toRequest(dto.endereco) : undefined
    };
  }

  static toResponse(dto: PessoaRequestDTO): PessoaResponseDTO {
    if (!dto) return {} as PessoaResponseDTO;

    return {
      imagemUrl: dto.imagemUrl,
      nome: dto.nome,
      nomeSocial: dto.nomeSocial,
      cpf: dto.cpf,
      rg: dto.rg,
      dataNascimento: dto.dataNascimento,
      sexo: dto.sexo,
      telefoneCelular: dto.telefoneCelular,
      telefoneFixo: dto.telefoneFixo,
      certificadoRegistro: dto.certificadoRegistro,
      email: dto.email,
      situacaoPessoa: dto.situacaoPessoa,
      nacionalidade: dto.nacionalidade,
      naturalidade: dto.naturalidade,
      estadoCivil: dto.estadoCivil,
      profissao: dto.profissao,
      etnia: dto.etnia,
      descricao: dto.descricao,
      endereco: dto.endereco ? EnderecoMapper.toResponse(dto.endereco) : undefined
    };
  }
}