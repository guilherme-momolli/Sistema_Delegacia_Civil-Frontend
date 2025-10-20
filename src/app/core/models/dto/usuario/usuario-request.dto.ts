export interface UsuarioRequestDTO {
    nome: string;
    email: string;
    senha: string;
    privilegio: string;
    delegaciaId?: number;
}