export enum PrivilegioCadastro {
    USUARIO = "USUARIO",
    ADMIN = "ADMIN"
}

export const PrivilegioCadastroDescricao: Record<PrivilegioCadastro, string> = {
  [PrivilegioCadastro.USUARIO]: 'Usuário',
  [PrivilegioCadastro.ADMIN]: 'Administrador'
};