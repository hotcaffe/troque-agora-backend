import { Expose } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateProposalItemsDTO {
    @IsString()
    @Expose()
    @IsNotEmpty()
    vc_itemTitulo: string;

    @IsString()
    @Expose()
    @IsNotEmpty()
    vc_descricao: string;

    @IsNumber()
    @Expose()
    @IsNotEmpty()
    fl_quantidade: number;
    
    @IsString()
    @Expose()
    @IsNotEmpty()
    ch_unidade: string;

    @IsString()
    @Expose()
    @IsNotEmpty()
    vc_situacaoProduto: string;

    @IsNumber()
    @Expose()
    @IsNotEmpty()
    id_categoria: number
}