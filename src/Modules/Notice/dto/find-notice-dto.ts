import { Expose, Type } from "class-transformer";
import { IsArray, IsBoolean, IsBooleanString, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, ValidateNested } from "class-validator";
import { CreateNoticeDetailsDTO } from "./create-notice-details-dto";

export class FindNoticeDTO {
    @IsNumberString()
    @IsOptional()
    @Expose()
    id_usuarioAnuncio: number;

    @IsNumberString()
    @IsOptional()
    @Expose()
    id_anuncioTroca: number;

    @IsNumberString()
    @IsOptional()
    @Expose()
    id_categoria: number;

    @IsString()
    @IsOptional()
    @Expose()
    vc_titulo: string;

    @IsString()
    @IsOptional()
    @Expose()
    vc_descricao: string;

    @IsNumberString()
    @IsOptional()
    @Expose()
    fl_quantidade: number;

    @IsString()
    @IsOptional()
    @Expose()
    ch_unidade: string;

    @IsNumberString()
    @IsOptional()
    @Expose()
    vl_preco: number;

    @IsString()
    @IsOptional()
    @Expose()
    vc_situacaoProduto: string;

    @IsBooleanString()
    @IsOptional()
    @Expose()
    bo_ativo: boolean;

    @IsString()
    @IsOptional()
    @Expose()
    vc_situacaoAnuncio: string

    // @IsArray()
    // @ValidateNested({each: true})
    // @Type(() => CreateNoticeDetailsDTO)
    // @IsOptional()
    // @Expose()
    // noticeDetails?: CreateNoticeDetailsDTO[];
}