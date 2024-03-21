import { Expose } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateUserAddressDTO {
    @IsString()
    @IsNotEmpty()
    @Expose()
    @IsOptional()
    vc_lougradouro: string;

    @IsString()
    @IsNotEmpty()
    @Expose()
    @IsOptional()
    in_numero: number;

    @IsString()
    @IsNotEmpty()
    @Expose()
    @IsOptional()
    vc_complemento: string;

    @IsString()
    @IsNotEmpty()
    @Expose()
    @IsOptional()
    vc_bairro: string;

    @IsString()
    @IsNotEmpty()
    @Expose()
    @IsOptional()
    vc_cidade: string;

    @IsString()
    @IsNotEmpty()
    @Expose()
    @IsOptional()
    vc_estado: string;

}
