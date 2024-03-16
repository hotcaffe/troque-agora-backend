import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseFilters, UsePipes, ValidationPipe } from "@nestjs/common";
import { NoticeService } from "./notice.service";
import { HttpExceptionFilter } from "../../filters/http-exception-filter.filter";
import { CreateNoticeDTO } from "./dto/create-notice-dto";
import { CreateNoticeDetailsDTO } from "./dto/create-notice-details-dto";

@Controller('notice')
export class NoticeController {
    constructor(private readonly noticeService: NoticeService) {}

    @Get()
    async findOne(
        @Query('id_anuncioTroca', ParseIntPipe) id_anuncioTroca: number,
        @Query('id_usuarioAnuncio', ParseIntPipe) id_usuarioAnuncio: number,
        @Query('relations') relations: string
    ) {
        return await this.noticeService.findOne(id_anuncioTroca, id_usuarioAnuncio, relations)
    }
    
    @Post()
    @UsePipes(new ValidationPipe({transform: true, transformOptions: {excludeExtraneousValues: true}}))
    async create(@Body() notice: CreateNoticeDTO) {
        return await this.noticeService.create(notice); 
    }

    update() {

    }


    delete() {

    }
}