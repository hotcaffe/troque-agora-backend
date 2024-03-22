import { Expose } from "class-transformer";
import {  IsBooleanString, IsNumberString, IsOptional, IsString } from "class-validator";

export class FindProposalDTO {
    @IsNumberString()
    @IsOptional()
    @Expose()
    id_propostaTroca: number;

    @IsString()
    @IsOptional()
    @Expose()
    vc_titulo: string;

    @IsString()
    @IsOptional()
    @Expose()
    vc_descricao: string;

    @IsBooleanString()
    @IsOptional()
    @Expose()
    bo_ativo: boolean;
}