export interface UsuarioResponseDTO {
    id: number;
    nome: string;
    email: string;
    privilegio: string;
    delegaciaId?: number;
}