import { Expose } from "class-transformer";
import {  IsBooleanString, IsEnum, IsNumberString, IsOptional, IsString } from "class-validator";

export class FindProposalNoticesSentDTO {
    @IsNumberString()
    @IsOptional()
    @Expose()
    id_usuarioAnuncio: number;

    @IsNumberString()
    @IsOptional()
    @Expose()
    id_anuncioTroca: number

    @IsNumberString()
    @IsOptional()
    @Expose()
    id_propostaTroca: number;
    
    @IsString()
    @IsEnum(['pending', 'rejected', 'canceled', 'accepted', 'finished'])
    @IsOptional()
    @Expose()
    vc_status: 'pending' | 'rejected' | 'canceled' | 'accepted' | 'finished';
}