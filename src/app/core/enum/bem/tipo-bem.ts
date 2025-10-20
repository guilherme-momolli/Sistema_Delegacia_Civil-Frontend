export enum TipoBem {
    ARMA = 'ARMA',
    VEICULO = 'VEICULO',
    DROGA = 'DROGA',
    OBJETO = 'OBJETO'
};

export const TipoArmaFogoDescricao: Record<TipoBem, string> = {
    [TipoBem.ARMA]: 'Arma',
    [TipoBem.VEICULO]: 'Veículo',
    [TipoBem.DROGA]: 'Droga',
    [TipoBem.OBJETO]: 'Objeto'
};
