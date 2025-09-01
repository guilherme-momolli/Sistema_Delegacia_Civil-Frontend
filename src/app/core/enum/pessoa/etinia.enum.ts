export enum Etnia {
  BRANCA = 'BRANCA',
  PRETA = 'PRETA',
  PARDA = 'PARDA',
  AMARELA = 'AMARELA',
  INDIGENA = 'INDIGENA'
};

export const EtniaDescricao: Record<Etnia, string> = {
  [Etnia.BRANCA]: 'Branca',
  [Etnia.PRETA]: 'Preta',
  [Etnia.PARDA]: 'Parda',
  [Etnia.AMARELA]: 'Amarela',
  [Etnia.INDIGENA]: 'Indígena'
};
