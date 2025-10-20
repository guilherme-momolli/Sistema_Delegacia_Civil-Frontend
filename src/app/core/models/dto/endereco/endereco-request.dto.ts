export interface EnderecoRequestDTO {
  id?: number;
  numero?: number;
  logradouro?: string;
  bairro?: string;
  municipio?: string;
  uf?: string;
  pais?: string;
  cep?: string;
}