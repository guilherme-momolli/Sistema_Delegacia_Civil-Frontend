import { EnderecoResponseDTO } from "../endereco/endereco-response.dto";

export interface PessoaResponseDTO{

    id: number;
    imagemUrl?: string;
    nome: string;
    nomeSocial?: string;
    cpf?: string;
    rg?: string;
    dataNascimento?: string;
    sexo: string;
    telefoneCelular?: string;
    telefoneFixo?: string;
    certificadoRegistro?: string;
    email?: string;
    situacaoPessoa?: string;
    nacionalidade?: string;
    naturalidade?: string;
    estadoCivil?: string;
    profissao?: string;
    etnia?: string;
    descricao?: string;
    endereco?: EnderecoResponseDTO;

}