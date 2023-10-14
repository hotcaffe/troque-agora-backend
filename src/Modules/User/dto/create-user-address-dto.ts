import { Expose } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateUserAddressDto {
    @IsString()
    @IsNotEmpty()
    @Expose()
    vc_lougradouro: string;

    @IsString()
    @IsNotEmpty()
    @Expose()
    in_numero: number;

    @IsString()
    @IsNotEmpty()
    @Expose()
    vc_complemento: string;

    @IsString()
    @IsNotEmpty()
    @Expose()
    vc_bairro: string;

    @IsString()
    @IsNotEmpty()
    @Expose()
    vc_cidade: string;

    @IsString()
    @IsNotEmpty()
    @Expose()
    vc_estado: string;

}
