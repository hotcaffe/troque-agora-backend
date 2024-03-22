import { Expose } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";



export class CreateProposalNoticesDTO {   
    @IsNumber()
    @IsNotEmpty()
    @Expose()
    id_usuarioAnuncio: number;

    @IsNumber()
    @IsNotEmpty()
    @Expose()
    id_anuncioTroca: number;

    @IsString()
    @IsEnum(['pending', 'rejected', 'canceled', 'accepted', 'finished'])
    @IsNotEmpty()
    @Expose()
    vc_status: 'pending' | 'rejected' | 'canceled' | 'accepted' | 'finished';
}