export enum TipoEnvolvimento {

  AUTOR = 'AUTOR',
  INVESTIGADOR = 'INVESTIGADOR',
  RELATOR = 'RELATOR',
  TESTEMUNHA = 'TESTEMUNHA',
  VITIMA = 'VITIMA',

};

export const TipoEnvolvimentoDescricao: Record<TipoEnvolvimento, string> = {
  [TipoEnvolvimento.AUTOR]: 'Autor',
  [TipoEnvolvimento.INVESTIGADOR]: 'Investigador',
  [TipoEnvolvimento.RELATOR]: 'Relator',
  [TipoEnvolvimento.TESTEMUNHA]: 'Testemunha',
  [TipoEnvolvimento.VITIMA]: 'Vitima'
};
