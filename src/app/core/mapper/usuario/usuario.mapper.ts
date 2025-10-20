import { UsuarioRequestDTO } from "../../models/dto/usuario/usuario-request.dto";
import { UsuarioResponseDTO } from "../../models/dto/usuario/usuario-response.dto";

export class UsuarioMapper {
    private constructor() { }   
    static formToRequest(formValue: any): UsuarioRequestDTO {
        return {
            nome: formValue.nome,
            email: formValue.email,
            senha: formValue.senha,
            privilegio: formValue.privilegio,
            delegaciaId: formValue.delegaciaId
        };
    }

    static toResponse(dto: any): UsuarioResponseDTO {
        return {
            id: dto.id,
            nome: dto.nome,
            email: dto.email,
            privilegio: dto.privilegio,
            delegaciaId: dto.delegaciaId
        };
    }

}