export enum Genero {
  MASCULINO = 'MASCULINO',
  FEMININO = 'FEMININO',
  HOMEM_TRANSGENERO = 'HOMEM_TRANSGENERO',
  MULHER_TRANSGENERO = 'MULHER_TRANSGENERO'
};

export const GeneroDescricao: Record<Genero, string> = {
  [Genero.MASCULINO]: 'Masculino',
  [Genero.FEMININO]: 'Feminino',
  [Genero.HOMEM_TRANSGENERO]: 'Homem transgênero',
  [Genero.MULHER_TRANSGENERO]: 'Mulher transgênero'
};
