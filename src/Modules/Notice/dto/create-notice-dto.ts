import { Expose, Type } from "class-transformer";
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { CreateNoticeDetailsDTO } from "./create-notice-details-dto";

export class CreateNoticeDTO {
    @IsNumber()
    @IsNotEmpty()
    @Expose()
    id_usuarioAnuncio: number;

    @IsNumber()
    @IsNotEmpty()
    @Expose()
    id_categoria: number;

    @IsString()
    @IsNotEmpty()
    @Expose()
    vc_titulo: string;

    @IsString()
    @IsNotEmpty()
    @Expose()
    vc_descricao: string;

    @IsNumber()
    @IsNotEmpty()
    @Expose()
    fl_quantidade: number;

    @IsString()
    @IsNotEmpty()
    @Expose()
    ch_unidade: string;

    @IsNumber()
    @IsNotEmpty()
    @Expose()
    vl_preco: number;

    @IsString()
    @IsNotEmpty()
    @Expose()
    vc_situacaoProduto: string;

    @IsBoolean()
    @IsOptional()
    @Expose()
    bo_ativo: boolean;

    @IsString()
    @IsNotEmpty()
    @Expose()
    vc_situacaoAnuncio: string

    @IsArray()
    @ValidateNested({each: true})
    @Type(() => CreateNoticeDetailsDTO)
    @IsOptional()
    @Expose()
    noticeDetails?: CreateNoticeDetailsDTO[];
}