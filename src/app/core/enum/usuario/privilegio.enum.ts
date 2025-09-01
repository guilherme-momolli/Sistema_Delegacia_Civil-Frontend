export enum Privilegio {
    USUARIO = "USUARIO",
    ADMIN = "ADMIN",
}

export const PrivilegioDescricao: Record<Privilegio, string> = {
  [Privilegio.USUARIO]: 'Usuário',
  [Privilegio.ADMIN]: 'Administrador'
};