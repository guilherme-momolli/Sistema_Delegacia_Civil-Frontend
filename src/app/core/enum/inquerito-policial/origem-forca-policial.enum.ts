export enum OrigemForcaPolicial {
  PCPR = "PCPR",
  PMPR = "PMPR",
  CBM = "CBM",
  GM = "GM",
  PF = "PF",
  PRF = "PRF",
  PEN = "PEN",
  DEPEN = "DEPEN",
  MP = "MP"
}

export const OrigemForcaPolicialDescricao: Record<OrigemForcaPolicial, string> = {
  [OrigemForcaPolicial.PCPR]: "Polícia Civil",
  [OrigemForcaPolicial.PMPR]: "Polícia Militar",
  [OrigemForcaPolicial.CBM]: "Corpo de Bombeiros Militar",
  [OrigemForcaPolicial.GM]: "Guarda Municipal",
  [OrigemForcaPolicial.PF]: "Polícia Federal",
  [OrigemForcaPolicial.PRF]: "Polícia Rodoviária Federal",
  [OrigemForcaPolicial.PEN]: "Polícia Penal",
  [OrigemForcaPolicial.DEPEN]: "Departamento Penitenciário",
  [OrigemForcaPolicial.MP]: "Ministério Público"
};
