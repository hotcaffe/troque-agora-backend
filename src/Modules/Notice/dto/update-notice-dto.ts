import { Expose, Type } from "class-transformer";
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { UpdateNoticeDetailsDTO } from "./update-notice-details-dto";

export class UpdateNoticeDTO {
    @IsNumber()
    @IsOptional()
    @IsNotEmpty()
    @Expose()
    id_categoria: number;

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    @Expose()
    vc_titulo: string;

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    @Expose()
    vc_descricao: string;

    @IsNumber()
    @IsOptional()
    @IsNotEmpty()
    @Expose()
    fl_quantidade: number;

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    @Expose()
    ch_unidade: string;

    @IsNumber()
    @IsOptional()
    @IsNotEmpty()
    @Expose()
    vl_preco: number;

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    @Expose()
    vc_situacaoProduto: string;

    @IsBoolean()
    @IsOptional()
    @IsNotEmpty()
    @Expose()
    bo_ativo: boolean;

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    @Expose()
    vc_situacaoAnuncio: string

    @IsArray()
    @ValidateNested({each: true})
    @Type(() => UpdateNoticeDetailsDTO)
    @IsOptional()
    @IsNotEmpty()
    @Expose()
    noticeDetails?: UpdateNoticeDetailsDTO[];
}