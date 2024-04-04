import { Controller, Delete, Get, Post, Query, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FirebaseService } from "./firebase.service";
import { FilesInterceptor } from "@nestjs/platform-express";

@Controller('storage')
export class FirebaseController {
    constructor(private readonly firebaseService: FirebaseService) {}

    @Get()
    findImages(@Query('folder') folder: string) {
        return this.firebaseService.findImages(folder);
    }   

    @Post()
    @UseInterceptors(FilesInterceptor('images'))
    createImages(@UploadedFiles() files: Array<Express.Multer.File>, @Query('folder') folder: string) {
        return this.firebaseService.createImages(files, folder);
    }

    @Delete()
    deleteImage(@Query('id') id: string, @Query('folder') folder: string) {
        return this.firebaseService.deleteImage(id, folder);
    }
}