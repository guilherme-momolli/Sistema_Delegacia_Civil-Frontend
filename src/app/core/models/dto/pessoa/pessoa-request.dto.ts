import { EnderecoRequestDTO } from "../endereco/endereco-request.dto";

export interface PessoaRequestDTO {

    imagemUrl?: string;
    nome: string;
    nomeSocial?: string;
    cpf?: string;
    rg?: string;
    dataNascimento?: string;
    sexo?: string;
    telefoneCelular?: string;
    telefoneFixo?: string;
    email?: string;
    certificadoRegistro?: string;
    situacaoPessoa?: string;
    nacionalidade?: string;
    naturalidade?: string;
    estadoCivil?: string;
    profissao?: string;
    etnia?: string;
    descricao?: string;
    endereco?: EnderecoRequestDTO;
}