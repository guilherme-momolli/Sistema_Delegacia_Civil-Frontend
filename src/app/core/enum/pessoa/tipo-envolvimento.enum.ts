export enum TipoEnvolvimento {
  VITIMA = 'VITIMA',
  INVESTIGADOR = 'INVESTIGADOR',
  AUTOR = 'AUTOR',
  RELATOR = 'RELATOR'
};

export const TipoEnvolvimentoDescricao: Record<TipoEnvolvimento, string> = {
  [TipoEnvolvimento.VITIMA]: 'Vitima',
  [TipoEnvolvimento.INVESTIGADOR]: 'Investigador',
  [TipoEnvolvimento.AUTOR]: 'Autor',
  [TipoEnvolvimento.RELATOR]: 'Relator'
};
