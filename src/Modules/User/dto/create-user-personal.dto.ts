import { Expose } from "class-transformer";
import { IsNotEmpty, IsString, IsNumber, IsDate, IsDateString, Validate } from "class-validator";
import { BirthdayConstraint } from "src/class-validators/birthday-validator";

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

    @IsDateString()
    @IsNotEmpty()
    @Expose()
    @Validate(BirthdayConstraint)
    dt_nascimento: Date;

    @IsString()
    @IsNotEmpty()
    @Expose()
    vc_email: string;
}
