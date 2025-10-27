export enum TipoBem {
    ARMA = 'ARMA',
    VEICULO = 'VEICULO',
    DROGA = 'DROGA',
    OBJETO = 'OBJETO'
};

export const TipoBemDescricao: Record<TipoBem, string> = {
    [TipoBem.ARMA]: 'Arma',
    [TipoBem.VEICULO]: 'Veículo',
    [TipoBem.DROGA]: 'Droga',
    [TipoBem.OBJETO]: 'Objeto'
};
