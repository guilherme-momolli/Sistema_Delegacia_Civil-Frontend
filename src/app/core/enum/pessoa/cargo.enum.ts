export enum Cargo {
  AGENTE = 'AGENTE',
  ATENDENTE = 'ATENDENTE',
  DELEGADO = 'DELEGADO',
  ESCRIVAO = 'ESCRIVAO',
  ESTAGIARIO = 'ESTAGIARIO',
  INVESTIGADOR = 'INVESTIGADOR',
  PERITO = 'PERITO',
  PAPILOSCOPISTA = 'PAPILOSCOPISTA',
  TI = 'TI'
};

export const CargoDescricao: Record<Cargo, string> = {
  [Cargo.AGENTE]: 'Agente',
  [Cargo.ATENDENTE]: 'Atendente',
  [Cargo.DELEGADO]: 'Delegado',
  [Cargo.ESCRIVAO]: 'Escrivão',
  [Cargo.ESTAGIARIO]: 'Estagiário',
  [Cargo.INVESTIGADOR]: 'Investigador',
  [Cargo.PERITO]: 'Perito',
  [Cargo.PAPILOSCOPISTA]: 'Papiloscopista',
  [Cargo.TI]: 'Tecnólogo da Informação - T.I'
};
