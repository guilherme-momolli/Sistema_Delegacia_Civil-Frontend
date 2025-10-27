export enum Carroceria {
    SEDAN  = 'SEDAN',
    HATCHBACK = 'HATCHBACK',
    SUV = 'SUV',
    CONVERSIVEL = 'CONVERSIVEL',
    PERUA = 'PERUA',
    FURGAO = 'FURGAO',

    PASSAGEIRO_MONOBLOCO = 'PASSAGEIRO_MONOBLOCO',

    CARGA_ABERTA = 'CARGA_ABERTA',
    CARGA_FECHADA = 'CARGA_FECHADA',
    CARGA_MISTA = 'CARGA_MISTA',
    GRANELEIRA = 'GRANELEIRA',
    BASCULANTE = 'BASCULANTE',
    TANQUE = 'TANQUE',
    SIDER = 'SIDER',
    FRIGORIFICO = 'FRIGORIFICO',
    PLATAFORMA = 'PLATAFORMA',
    PORTA_CONTAINER = 'PORTA_CONTAINER',
    CEGONHA = 'CEGONHA',

    MOTORHOME = 'MOTORHOME',
    CARENAGEM_PADRAO = 'CARENAGEM_PADRAO',
    IMPLEMENTO_AGRICOLA = 'IMPLEMENTO_AGRICOLA',
    CHASSI = 'CHASSI',
}

export const CarroceriaDescricao: Record<Carroceria, string> = {
    [Carroceria.SEDAN]: 'Sedan',
    [Carroceria.HATCHBACK]: 'Hatchback',
    [Carroceria.SUV]: 'Veiculo Utilitário Esportivo - SUV',
    [Carroceria.CONVERSIVEL]: 'Conversível',
    [Carroceria.PERUA]: 'Perua',
    [Carroceria.FURGAO]: 'Furgão',

    [Carroceria.PASSAGEIRO_MONOBLOCO]: 'Passageiro Monobloco',

    [Carroceria.CARGA_ABERTA]: 'Carga Aberta',
    [Carroceria.CARGA_FECHADA]: 'Carga Fechada',
    [Carroceria.CARGA_MISTA]: 'Carga Mista',
    [Carroceria.GRANELEIRA]: 'Graneleira',
    [Carroceria.BASCULANTE]: 'Basculante',
    [Carroceria.TANQUE]: 'Tanque',
    [Carroceria.SIDER]: 'Sider',
    [Carroceria.FRIGORIFICO]: 'Frigorífico',
    [Carroceria.PLATAFORMA]: 'Plataforma',
    [Carroceria.PORTA_CONTAINER]: 'Porta Container',
    [Carroceria.CEGONHA]: 'Cegonha',

    [Carroceria.MOTORHOME]: 'Motorhome',
    [Carroceria.CARENAGEM_PADRAO]: 'Carenagem Padrão',
    [Carroceria.IMPLEMENTO_AGRICOLA]: 'Implemento Agrícola',
    [Carroceria.CHASSI]: 'Chassi',
};