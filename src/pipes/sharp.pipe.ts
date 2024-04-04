import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import * as sharp from "sharp";

@Injectable()
export class SharpPipe implements PipeTransform<Express.Multer.File, Promise<Array<Express.Multer.File> | Express.Multer.File>> {
    async transform(image: Array<Express.Multer.File> | Express.Multer.File, metadata: ArgumentMetadata): Promise<Array<Express.Multer.File> | Express.Multer.File> {
        if (Array.isArray(image)) {
            return await Promise.all(image.map(async (img) => {
                const buffer = await sharp(img.buffer).resize(800).webp().toBuffer();
                return {
                    ...img,
                    mimetype: 'image/webp',
                    buffer
                }
            }));
        } else {
            const buffer = await sharp(image.buffer).resize(800).webp().toBuffer();
            return {
                ...image,
                mimetype: 'image/webp',
                buffer
            }
        }
    }
}