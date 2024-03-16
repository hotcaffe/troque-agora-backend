import { Expose } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateNoticeDetailsDTO { 
    @IsString()
    @IsNotEmpty()
    @Expose()
    vc_titulo: string;

    
    @IsString()
    @IsNotEmpty()
    @Expose()
    vc_conteudo: string
}