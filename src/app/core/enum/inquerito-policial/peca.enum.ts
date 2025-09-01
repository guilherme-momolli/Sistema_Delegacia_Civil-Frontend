export enum Peca {
  APF = 'APF',
  PORTARIA = 'PORTARIA'
};

export const PecaDescricao: Record<Peca, string> = {
  [Peca.APF]: 'Auto de Prisão em Flagrante',
  [Peca.PORTARIA]: 'Portaria'
};