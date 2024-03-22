import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, Request, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { ProposalService } from "./proposal.service";
import { AuthGuard } from "src/guards/auth.guard";
import { FindProposalDTO } from "./dto/find-proposal-dto";
import { FindProposalNoticesReceivedDTO } from "./dto/find-proposal-notices-received-dto";
import { FindProposalNoticesSentDTO } from "./dto/find-proposal-notices-sent-dto";
import { CreateProposalDTO } from "./dto/create-proposal-dto";

@Controller('proposal')
export class ProposalController {
    constructor(private readonly proposalService: ProposalService) {}

    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe(
        {transform: false, transformOptions: {excludeExtraneousValues: true}, skipMissingProperties: true, skipNullProperties: true, skipUndefinedProperties: true})
    )
    @Get()
    async find(
        @Query() where: FindProposalDTO,
        @Query('relations') relations: string,
        @Query('page') page: number,
        @Query('take') take: number,
        @Request() request: any,
    ) {
        const id_usuarioProposta = request.introspected_access_token.id_usuario as number;
        return await this.proposalService.find(id_usuarioProposta, where, page, take, relations);
    }

    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe(
        {transform: false, transformOptions: {excludeExtraneousValues: true}, skipMissingProperties: true, skipNullProperties: true, skipUndefinedProperties: true})
    )
    @Get('/received')
    async findReceived(
        @Query() where: FindProposalNoticesReceivedDTO,
        @Query('relations') relations: string,
        @Query('page') page: number,
        @Query('take') take: number,
        @Request() request: any,
    ) {
        const id_usuarioAnuncio = request.introspected_access_token.id_usuario as number;
        return await this.proposalService.findReceived(id_usuarioAnuncio, where, page, take, relations);
    }

    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe(
        {transform: false, transformOptions: {excludeExtraneousValues: true}, skipMissingProperties: true, skipNullProperties: true, skipUndefinedProperties: true})
    )
    @Get('/sent')
    async findSent(
        @Query() where: FindProposalNoticesSentDTO,
        @Query('relations') relations: string,
        @Query('page') page: number,
        @Query('take') take: number,
        @Request() request: any,
    ) {
        const id_usuarioProposta = request.introspected_access_token.id_usuario as number;
        return await this.proposalService.findSent(id_usuarioProposta, where, page, take, relations);
    }

    @UseGuards(AuthGuard)
    @Get(':id_propostaTroca')
    async findOne(
        @Param('id_propostaTroca', ParseIntPipe) id_propostaTroca: number,
        @Query('relations') relations: string,
        @Request() request: any, 
    ) {
        const id_usuarioProposta = request.introspected_access_token.id_usuario as number;
        return await this.proposalService.findOne(id_propostaTroca, id_usuarioProposta, relations);
    }

    @UseGuards(AuthGuard)
    @Patch('/cancel')
    async cancel(
        @Query('id_propostaTroca', ParseIntPipe) id_propostaTroca: number,
        @Request() request: any
    ) {
        const id_usuarioProposta = request.introspected_access_token.id_usuario as number;
        return await this.proposalService.cancel(id_usuarioProposta, id_propostaTroca);
    }

    @UseGuards(AuthGuard)
    @Patch('/reject')
    async reject(
        @Query('id_propostaTroca', ParseIntPipe) id_propostaTroca: number,
        @Query('id_anuncioTroca', ParseIntPipe) id_anuncioTroca: number,
        @Query('id_usuarioProposta', ParseIntPipe) id_usuarioProposta: number,
        @Request() request: any
    ) {
        const id_usuarioAnuncio = request.introspected_access_token.id_usuario as number;
        return await this.proposalService.reject(id_anuncioTroca, id_usuarioAnuncio, id_propostaTroca, id_usuarioProposta);
    }

    @UseGuards(AuthGuard)
    @Patch('/accept')
    async accept(
        @Query('id_propostaTroca', ParseIntPipe) id_propostaTroca: number,
        @Query('id_anuncioTroca', ParseIntPipe) id_anuncioTroca: number,
        @Query('id_usuarioProposta', ParseIntPipe) id_usuarioProposta: number,
        @Request() request: any
    ) {
        const id_usuarioAnuncio = request.introspected_access_token.id_usuario as number;
        return await this.proposalService.accept(id_anuncioTroca, id_usuarioAnuncio, id_propostaTroca, id_usuarioProposta);
    }

    @UseGuards(AuthGuard)
    @Post()
    async relateTo(
        @Body() proposal: CreateProposalDTO,
        @Request() request: any
    ) {
        const id_usuarioProposta = request.introspected_access_token.id_usuario as number;
        return await this.proposalService.relateTo(id_usuarioProposta, proposal)
    }
}