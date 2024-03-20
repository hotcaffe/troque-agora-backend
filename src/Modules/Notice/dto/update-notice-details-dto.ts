import { Expose } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class UpdateNoticeDetailsDTO {  
    @IsNumber()
    @IsNotEmpty()
    @Expose()
    id_detalheTroca: number;
    
    @IsString()
    @IsNotEmpty()
    @Expose()
    vc_titulo: string;

    
    @IsString()
    @IsNotEmpty()
    @Expose()
    vc_conteudo: string
}