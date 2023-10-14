import { Expose } from "class-transformer";
import { IsNotEmpty, IsString, IsNumber } from "class-validator";

export class CreateUserPersonalDataDto {
    @IsString()
    @IsNotEmpty()
    @Expose()
    vc_nome: string;

    @IsNumber()
    @IsNotEmpty()
    @Expose()
    in_cpf: number;

    @IsNumber()
    @IsNotEmpty()
    @Expose()
    in_celular: number;

    @IsNumber()
    @IsNotEmpty()
    @Expose()
    in_idade: number;

    @IsString()
    @IsNotEmpty()
    @Expose()
    vc_email: string;
}
