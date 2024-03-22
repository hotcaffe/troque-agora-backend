import { Expose, Type } from "class-transformer";
import { IsArray, IsBoolean, IsBooleanString, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, ValidateNested } from "class-validator";
export class UpdateCategoryDTO {
    @Expose()
    @IsString()
    @IsOptional()
    vc_titulo: string;

    @Expose()
    @IsString()
    @IsOptional()
    vc_descricao: string;

    @Expose()
    @IsString()
    @IsOptional()
    vc_icone: string;

    @Expose()
    @IsBoolean()
    @IsOptional()
    bo_ativo: boolean;
}