export enum EstadoCivil {
  CASADO = 'CASADO',
  DIVORCIADO = 'DIVORCIADO',
  SEPARADO = 'SEPARADO',
  SOLTEIRO = 'SOLTEIRO',
  UNIAO_ESTAVEL = 'UNIAO_ESTAVEL',
  VIUVO = 'VIUVO'
};

export const EstadoCivilDescricao: Record<EstadoCivil, string> = {
  [EstadoCivil.CASADO]: 'Casado',
  [EstadoCivil.DIVORCIADO]: 'Divorciado',
  [EstadoCivil.SEPARADO]: 'Separado',
  [EstadoCivil.SOLTEIRO]: 'Solteiro',
  [EstadoCivil.UNIAO_ESTAVEL]: 'União Estável',
  [EstadoCivil.VIUVO]: 'Viúvo'
};