export enum SituacaoPessoa {
  AFASTADO = 'AFASTADO',
  CONDENADO = 'CONDENADO',
  DESAPARECIDO = 'DESAPARECIDO',
  DESCONHECIDO = 'DESCONHECIDO',
  FALECIDO = 'FALECIDO',
  FORAJIDO = 'FORAJIDO',
  INDICIADO = 'INDICIADO',
  INVESTIGADO = 'INVESTIGADO',
  PRESO = 'PRESO',
  RE = 'RE',
  REGULAR = 'REGULAR',
  SUSPEITO = 'SUSPEITO',
  TESTEMUNHA = 'TESTEMUNHA'
};

export const SituacaoPessoaDescricao: Record<SituacaoPessoa, string> = {
  [SituacaoPessoa.AFASTADO]: 'Afastado',
  [SituacaoPessoa.CONDENADO]: 'Condenado',
  [SituacaoPessoa.DESAPARECIDO]: 'Desaparecido',
  [SituacaoPessoa.DESCONHECIDO]: 'Desconhecido',
  [SituacaoPessoa.FALECIDO]: 'Falecido',
  [SituacaoPessoa.FORAJIDO]: 'Forajido',
  [SituacaoPessoa.INDICIADO]: 'Indiciado',
  [SituacaoPessoa.INVESTIGADO]: 'Investigado',
  [SituacaoPessoa.PRESO]: 'Preso',
  [SituacaoPessoa.RE]: 'Ré',
  [SituacaoPessoa.REGULAR]: 'Regular',
  [SituacaoPessoa.SUSPEITO]: 'Suspeito',
  [SituacaoPessoa.TESTEMUNHA]: 'Testemunha'
};
