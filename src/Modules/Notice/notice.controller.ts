import { Body, Controller, Delete, FileTypeValidator, Get, ParseArrayPipe, ParseFilePipe, ParseIntPipe, Patch, Post, Query, Request, UploadedFiles, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { NoticeService } from "./notice.service";
import { CreateNoticeDTO } from "./dto/create-notice-dto";
import { FindNoticeDTO } from "./dto/find-notice-dto";
import { UpdateNoticeDTO } from "./dto/update-notice-dto";
import { AuthGuard } from "src/guards/auth.guard";
import { FileFieldsInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { SharpPipe } from "src/pipes/sharp.pipe";

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

    @Get('/list')
    @UsePipes(new ValidationPipe(
        {transform: false, transformOptions: {excludeExtraneousValues: true}, skipMissingProperties: true, skipNullProperties: true, skipUndefinedProperties: true})
    )
    async find(
        @Query() where: FindNoticeDTO,
        @Query('page') page: number,
        @Query('take') take: number,
        @Query('relations') relations: string
    ) {
        return await this.noticeService.find(where, page, take, relations)
    }

    @UseGuards(AuthGuard)
    @Post()
    @UsePipes(new ValidationPipe({transform: true, transformOptions: {excludeExtraneousValues: true}}))
    async create(@Request() request: any, @Body() notice: CreateNoticeDTO) {
        const id_usuario = request.introspected_access_token.id_usuario as number;
        return await this.noticeService.create(id_usuario, notice); 
    }

    @UseGuards(AuthGuard)
    @Post('/images')
    @UseInterceptors(FilesInterceptor('images'))
    async createImages(
        @Request() request: any, 
        @Query('id_anuncioTroca', ParseIntPipe) id_anuncioTroca: number, 
        @UploadedFiles(
            new ParseFilePipe({
                validators: [
                    new FileTypeValidator({fileType: 'image'})
                ]
            }),
            new SharpPipe()
        ) images: Array<Express.Multer.File>
    ) {
        const id_usuario = request.introspected_access_token.id_usuario as number;
        return await this.noticeService.createImages(images, id_usuario, id_anuncioTroca);
    }

    @UseGuards(AuthGuard)
    @Patch()
    @UsePipes(new ValidationPipe({transform: true, transformOptions: {excludeExtraneousValues: true}, skipUndefinedProperties: true}))
    async update(
        @Query('id_anuncioTroca', ParseIntPipe) id_anuncioTroca: number,
        @Body() notice: UpdateNoticeDTO,
        @Request() request: any
    ) {
        const id_usuarioAnuncio = request.introspected_access_token.id_usuario as number;
        return await this.noticeService.update(id_anuncioTroca, id_usuarioAnuncio, notice)
    }

    @UseGuards(AuthGuard)
    @Patch('/images')
    @UseInterceptors(FilesInterceptor('imagesInserted'))
    async updateImages(
        @Request() request: any, 
        @Query('id_anuncioTroca', ParseIntPipe) id_anuncioTroca: number, 
        @UploadedFiles(
            new ParseFilePipe({
                validators: [
                    new FileTypeValidator({fileType: 'image'})
                ]
            }),
            new SharpPipe()
        ) imagesInserted: Array<Express.Multer.File>,
        @Body('imagesRemoved', ParseArrayPipe) imagesRemoved: string[]
    ) {
        const id_usuario = request.introspected_access_token.id_usuario as number;
        return await this.noticeService.updateImages(imagesInserted, imagesRemoved, id_usuario, id_anuncioTroca);
    }

    @UseGuards(AuthGuard)
    @Delete()
    async delete(
        @Query('id_anuncioTroca', ParseIntPipe) id_anuncioTroca: number,
        @Request() request: any
    ) {
        const id_usuarioAnuncio = request.introspected_access_token.id_usuario as number;
        return await this.noticeService.delete(id_anuncioTroca, id_usuarioAnuncio);
    }
}