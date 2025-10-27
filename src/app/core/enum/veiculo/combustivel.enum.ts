export enum Combustivel {

    DIESEL = 'DIESEL',
    ELETRICO = 'ELETRICO',
    ETANOL = 'ETANOL',
    FLEX = 'FLEX',
    GASOLINA = 'GASOLINA',
    GNV = 'GNV',
    HIBRIDO = 'HIBRIDO',
}

export const CombustivelDescricao: Record<Combustivel, string> = {
    [Combustivel.DIESEL]: 'Diesel',
    [Combustivel.ELETRICO]: 'Elétrico',
    [Combustivel.ETANOL]: 'Etanol',
    [Combustivel.FLEX]: 'Flex',
    [Combustivel.GASOLINA]: 'Gasolina',
    [Combustivel.GNV]: 'Gás Natural Veicular - GNV',
    [Combustivel.HIBRIDO]: 'Híbrido',
};