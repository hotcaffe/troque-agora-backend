import { Expose, Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, ValidateNested } from "class-validator";
import { UpdateUserAddressDTO } from "./update-user-address-dto";


export class UpdateUserDTO{
    @IsNumber()
    @IsNotEmpty()
    @Expose()
    @IsOptional()
    in_celular: number;

    // @ValidateNested({each: true})
    @Type(() => UpdateUserAddressDTO)
    @IsNotEmpty()
    @Expose()
    @IsOptional()
    userAddress?: UpdateUserAddressDTO;
}
