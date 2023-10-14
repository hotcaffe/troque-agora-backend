import { Transform, Expose } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @Expose()
    // @IsOptional()
    username: string;

    @IsString()
    @IsNotEmpty()
    @Expose()
    // @IsOptional()
    password: string;
}
