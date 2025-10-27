export enum TipoArmaFogo {
  REVOLVER = 'REVOLVER',
  PISTOLA = 'PISTOLA',
  GARRUCHA = 'GARRUCHA',
  DERRINGER = 'DERRINGER',
  ESPINGARDA = 'ESPINGARDA',
  CARABINA = 'CARABINA',
  FUZIL = 'FUZIL',
  METRALHADORA = 'METRALHADORA',
  RIFLE = 'RIFLE',
  ESCOPETA = 'ESCOPETA',
  SUBMETRALHADORA = 'SUBMETRALHADORA',
  MOSQUETAO = 'MOSQUETAO',
  LANCA_GRANADAS = 'LANCA_GRANADAS',
  LANCA_FOGUETES = 'LANCA_FOGUETES',
  PISTOLA_METRALHADORA = 'PISTOLA_METRALHADORA'
};

export const TipoArmaFogoDescricao: Record<TipoArmaFogo, string> = {
  [TipoArmaFogo.REVOLVER]: 'Revólver',
  [TipoArmaFogo.PISTOLA]: 'Pistola',
  [TipoArmaFogo.GARRUCHA]: 'Garrucha',
  [TipoArmaFogo.DERRINGER]: 'Derringer',
  [TipoArmaFogo.ESPINGARDA]: 'Espingarda',
  [TipoArmaFogo.CARABINA]: 'Carabina',
  [TipoArmaFogo.FUZIL]: 'Fuzil',
  [TipoArmaFogo.METRALHADORA]: 'Metralhadora',
  [TipoArmaFogo.RIFLE]: 'Rifle',
  [TipoArmaFogo.ESCOPETA]: 'Escopeta',
  [TipoArmaFogo.SUBMETRALHADORA]: 'Submetralhadora',
  [TipoArmaFogo.MOSQUETAO]: 'Mosquetão',
  [TipoArmaFogo.LANCA_GRANADAS]: 'Lança-granadas',
  [TipoArmaFogo.LANCA_FOGUETES]: 'Lança-foguetes',
  [TipoArmaFogo.PISTOLA_METRALHADORA]: 'Pistola-metralhadora'  
};
