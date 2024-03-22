import { Expose, Type } from "class-transformer";
import { IsArray, IsBoolean, IsBooleanString, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, ValidateNested } from "class-validator";
export class CreateCategoryDTO {
    @Expose()
    @IsString()
    vc_titulo: string;

    @Expose()
    @IsString()
    vc_descricao: string;

    @Expose()
    @IsString()
    vc_icone: string;

    @Expose()
    @IsBoolean()
    @IsOptional()
    bo_ativo: boolean;
}