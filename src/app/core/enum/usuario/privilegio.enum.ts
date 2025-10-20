export enum Privilegio {
    USUARIO = "USUARIO",
    ADMIN = "ADMIN",
    ADMIN_MASTER = "ADMIN_MASTER",
    CONTROLE_MESTRE = "CONTROLE_MESTRE"
}

export const PrivilegioDescricao: Record<Privilegio, string> = {
  [Privilegio.USUARIO]: 'Usuário',
  [Privilegio.ADMIN]: 'Administrador',
  [Privilegio.ADMIN_MASTER]: 'Administrador Master',
  [Privilegio.CONTROLE_MESTRE]: 'Controle Mestre'
};