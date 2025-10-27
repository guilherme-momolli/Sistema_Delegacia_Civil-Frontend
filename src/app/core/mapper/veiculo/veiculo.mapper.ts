import { VeiculoRequestDTO } from "../../models/dto/veiculo/veiculo-request.dto";
import { VeiculoResponseDTO } from "../../models/dto/veiculo/veiculo-response.dto";

export class VeiculoMapper{
 
    static toRequestDTO(veiculo: any): VeiculoRequestDTO {
    return {
      id: veiculo.id,
      bemId: veiculo.bemId,
      renavam: veiculo.renavam,
      placa: veiculo.placa,
      chassi: veiculo.chassi,
      numeroMotor: veiculo.numeroMotor,
      tipoVeiculo: veiculo.tipoVeiculo,
      categoria: veiculo.categoria,
      especieVeiculo: veiculo.especieVeiculo,
      anoModelo: veiculo.anoModelo,
      anoFabricacao: veiculo.anoFabricacao,
      combustivel: veiculo.combustivel,
      cambio: veiculo.cambio,
      tipoTracao: veiculo.tipoTracao,
      corPredominante: veiculo.corPredominante,
      carroceria: veiculo.carroceria,
      numeroEixos: veiculo.numeroEixos,
      capacidadeCarga: veiculo.capacidadeCarga,
      potenciaMotor: veiculo.potenciaMotor,
      cilindrada: veiculo.cilindrada,
      pesoBruto: veiculo.pesoBruto,
      ufRegistro: veiculo.ufRegistro,
      municipioRegistro: veiculo.municipioRegistro,
      situacaoVeiculo: veiculo.situacaoVeiculo,
      situacaoLicenciamento: veiculo.situacaoLicenciamento,
      restricaoJudicial: veiculo.restricaoJudicial,
      dataPrimeiroLicenciamento: veiculo.dataPrimeiroLicenciamento,
      numeroCrv: veiculo.numeroCrv,
      numeroCrlv: veiculo.numeroCrlv,
      tabelaFipe: veiculo.tabelaFipe
    };
  }

  
  static toResponseModel(dto: VeiculoResponseDTO): any {
    return {
      id: dto.id,
      bemId: dto.bemId,
      renavam: dto.renavam,
      placa: dto.placa,
      chassi: dto.chassi,
      numeroMotor: dto.numeroMotor,
      tipoVeiculo: dto.tipoVeiculo,
      categoria: dto.categoria,
      especieVeiculo: dto.especieVeiculo,
      anoModelo: dto.anoModelo,
      anoFabricacao: dto.anoFabricacao,
      combustivel: dto.combustivel,
      cambio: dto.cambio,
      tipoTracao: dto.tipoTracao,
      corPredominante: dto.corPredominante,
      carroceria: dto.carroceria,
      numeroEixos: dto.numeroEixos,
      capacidadeCarga: dto.capacidadeCarga,
      potenciaMotor: dto.potenciaMotor,
      cilindrada: dto.cilindrada,
      pesoBruto: dto.pesoBruto,
      ufRegistro: dto.ufRegistro,
      municipioRegistro: dto.municipioRegistro,
      situacaoVeiculo: dto.situacaoVeiculo,
      situacaoLicenciamento: dto.situacaoLicenciamento,
      restricaoJudicial: dto.restricaoJudicial,
      dataPrimeiroLicenciamento: dto.dataPrimeiroLicenciamento,
      numeroCrv: dto.numeroCrv,
      numeroCrlv: dto.numeroCrlv,
      tabelaFipe: dto.tabelaFipe,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
    };
  }
}