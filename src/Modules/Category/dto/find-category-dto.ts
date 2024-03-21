import { Expose, Type } from "class-transformer";
import { IsArray, IsBoolean, IsBooleanString, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, ValidateNested } from "class-validator";
export class FindCategoryDTO {
    @IsNumberString()
    @IsOptional()
    @Expose()
    id_categoria: number;

    @IsOptional()
    @Expose()
    @IsString()
    vc_titulo: string;

    @IsOptional()
    @Expose()
    @IsString()
    vc_descricao: string;

    @IsOptional()
    @Expose()
    @IsBooleanString()
    bo_ativo: boolean;
}