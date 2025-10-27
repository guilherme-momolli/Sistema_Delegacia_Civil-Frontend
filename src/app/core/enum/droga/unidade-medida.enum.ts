export enum UnidadeMedida {
  GRAMA = 'GRAMA',
  QUILOGRAMA = 'QUILOGRAMA',
  MILIGRAMA = 'MILIGRAMA',
  TONELADA = 'TONELADA',
  UNIDADE = 'UNIDADE',
  DUZIA = 'DUZIA',
  CENTENA = 'CENTENA',
  MILHEIRO = 'MILHEIRO',
  MILILITRO = 'MILILITRO',
  LITRO = 'LITRO',
  CENTIMETRO_CUBICO = 'CENTIMETRO_CUBICO',
  METRO_CUBICO = 'METRO_CUBICO',
  DECILITRO = 'DECILITRO',
  CENTILITRO = 'CENTILITRO'
};

export const UnidadeMedidaDescricao: Record<UnidadeMedida, string> = {
  [UnidadeMedida.GRAMA]: 'g',
  [UnidadeMedida.QUILOGRAMA]: 'kg',
  [UnidadeMedida.MILIGRAMA]: 'mg',
  [UnidadeMedida.TONELADA]: 't',
  [UnidadeMedida.UNIDADE]: 'unidade',
  [UnidadeMedida.DUZIA]: 'dúzia',
  [UnidadeMedida.CENTENA]: 'centena',
  [UnidadeMedida.MILHEIRO]: 'milheiro',
  [UnidadeMedida.MILILITRO]: 'ml',
  [UnidadeMedida.LITRO]: 'l',
  [UnidadeMedida.CENTIMETRO_CUBICO]: 'cm³',
  [UnidadeMedida.METRO_CUBICO]: 'm³',
  [UnidadeMedida.DECILITRO]: 'dl',
  [UnidadeMedida.CENTILITRO]: 'cl'
};
