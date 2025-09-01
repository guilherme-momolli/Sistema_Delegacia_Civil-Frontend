export enum SituacaoInquerito {
  ANDAMENTO = 'ANDAMENTO',
  FINALIZADO = 'FINALIZADO',
  DENUNCIADO = 'DENUNCIADO',
  RELATADO = 'RELATADO'
};

export const SituacaoInqueritoDescricao: Record<SituacaoInquerito, string> = {
  [SituacaoInquerito.ANDAMENTO]: 'Andamento',
  [SituacaoInquerito.FINALIZADO]: 'Finalizado',
  [SituacaoInquerito.DENUNCIADO]: 'Denunciado',
  [SituacaoInquerito.RELATADO]: 'Relatado'
};
