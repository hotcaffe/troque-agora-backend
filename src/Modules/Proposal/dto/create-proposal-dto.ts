import { Expose, Type } from "class-transformer";
import { ArrayMaxSize, ArrayMinSize, IsArray, IsBoolean, IsNotEmpty, IsNumber, IsString, Length, ValidateNested } from "class-validator";
import { CreateProposalNoticesDTO } from "./create-proposal-notices-dto";
import { CreateProposalItemsDTO } from "./create-proposal-items-dto";


export class CreateProposalDTO {   
    @IsString()
    @IsNotEmpty()
    @Expose()
    vc_titulo: string;

    @IsString()
    @IsNotEmpty()
    @Expose()
    vc_descricao: string;

    @ValidateNested({each: true})
    @Type(() => CreateProposalNoticesDTO)
    @Expose()
    @ArrayMinSize(1)
    @ArrayMaxSize(10)
    proposalNotices: CreateProposalNoticesDTO[];

    @IsArray()
    @ValidateNested({each: true})
    @Type(() => CreateProposalItemsDTO)
    @Expose()
    @ArrayMinSize(1)
    @ArrayMaxSize(20)
    proposalItems?: CreateProposalItemsDTO[];
}