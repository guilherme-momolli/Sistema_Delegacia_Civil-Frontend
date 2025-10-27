export interface VeiculoResponseDTO {
  id?: number;
  bemId?: number;

  renavam?: string;
  placa?: string;
  chassi?: string;
  numeroMotor?: string;

  tipoVeiculo?: string;           // Enum: TipoVeiculo
  categoria?: string;             // Enum: CategoriaVeiculo
  especieVeiculo?: string;        // Enum: EspecieVeiculo

  anoModelo?: string;             // LocalDate → string (ISO)
  anoFabricacao?: string;         // LocalDate → string (ISO)

  combustivel?: string;           // Enum: Combustivel
  cambio?: string;                // Enum: Cambio
  tipoTracao?: string;            // Enum: TipoTracao
  corPredominante?: string;
  carroceria?: string;            // Enum: Carroceria

  numeroEixos?: number;
  capacidadeCarga?: number;
  potenciaMotor?: number;
  cilindrada?: number;
  pesoBruto?: number;

  ufRegistro?: string;            // Enum: UF
  municipioRegistro?: string;

  situacaoVeiculo?: string;       // Enum: SituacaoVeiculo
  situacaoLicenciamento?: string; // Enum: SituacaoLicenciamento

  restricaoJudicial?: string;

  dataPrimeiroLicenciamento?: string; // LocalDate → string (ISO)

  numeroCrv?: string;
  numeroCrlv?: string;
  tabelaFipe?: string;
  createdAt?: string;
  updatedAt?: string;
}