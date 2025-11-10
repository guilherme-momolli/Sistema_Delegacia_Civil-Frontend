import { InqueritoPolicialRequestDTO } from "../../models/dto/inquerito-policial/inquerito-policial-request.dto";
import { InqueritoPolicialResponseDTO } from "../../models/dto/inquerito-policial/inquerito-policial-response.dto";
import { BemEnvolvimentoMapper } from "../bem-envolvimento/bem-envolvimento.mapper";
import { PessoaEnvolvimentoMapper } from "../pessoa-envolvimento/pessoa-envolvimento.mapper";

export class InqueritoPolicialMapper {

    static toRequest(formValue: any): InqueritoPolicialRequestDTO {
        return {
            numeroJustica: formValue.numeroJustica,
            ordemIp: formValue.ordemIp || undefined,
            data: formValue.data,
            peca: formValue.peca || undefined,
            situacaoInquerito: formValue.situacaoInquerito || undefined,
            origemForcaPolicial: formValue.origemForcaPolicial || undefined,
            naturezaDoDelito: formValue.naturezaDoDelito || undefined,
            observacao: formValue.observacao || undefined,
            delegaciaId: formValue.delegaciaId,
            pessoasEnvolvidas: formValue.pessoasEnvolvidas
                ? formValue.pessoasEnvolvidas.map((p: any) =>
                    PessoaEnvolvimentoMapper.toRequest(p, formValue.id)
                )
                : [],
            bensEnvolvidos: formValue.bensEnvolvidos
                ? formValue.bensEnvolvidos.map((b: any) =>
                    BemEnvolvimentoMapper.toRequest(b, formValue.id)
                )
                : []
        };
    }

    static toFormModel(dto: InqueritoPolicialResponseDTO) {
        return {
            id: dto.id,
            numeroJustica: dto.numeroJustica,
            ordemIp: dto.ordemIp,
            data: dto.data,
            peca: dto.peca,
            situacaoInquerito: dto.situacaoInquerito,
            origemForcaPolicial: dto.origemForcaPolicial,
            naturezaDoDelito: dto.naturezaDoDelito,
            observacao: dto.observacao,
            delegaciaId: dto.delegaciaId,
            pessoasEnvolvidas: dto.pessoasEnvolvidas?.map(p =>
                PessoaEnvolvimentoMapper.toFormModel(p)
            ) || [],
            bensEnvolvidos: dto.bensEnvolvidos?.map(b =>
                BemEnvolvimentoMapper.toFormModel(b)
            ) || []
        };
    }
}