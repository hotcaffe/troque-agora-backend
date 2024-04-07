import { HttpException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Notice } from "./entities/notice.entity";
import {  Repository } from "typeorm";
import { NoticeDetails } from "./entities/noticeDetails.entity";
import { CreateNoticeDTO } from "./dto/create-notice-dto";
import { FindNoticeDTO } from "./dto/find-notice-dto";
import { UpdateNoticeDTO } from "./dto/update-notice-dto";
import { FirebaseService } from "../firebase/firebase.service";

@Injectable()
export class NoticeService {
    constructor(
        @InjectRepository(Notice) private readonly noticeRepository: Repository<Notice>,
        @InjectRepository(NoticeDetails) private readonly noticeDetailsRepository: Repository<NoticeDetails>,
        private readonly firebaseService: FirebaseService
    ){}

    async findOne(id_anuncioTroca: number, id_usuarioAnuncio: number, relations: string) {
        const _relations = relations?.split(',')?.map(rel => ({[rel.trim()]: true})) || [];
        const {noticeDetails, category, user, userReview, userAddress} = Object.assign({noticeDetails: false, category: false, user: false, userReview: false, userAddress: false}, ..._relations)

        const notice = await this.noticeRepository.findOne({
            where: {
                id_anuncioTroca,
                id_usuarioAnuncio
            },
            relations: {
                noticeDetails,
                category,
                user: user ? {
                    userAddress,
                    userReview
                } : false
            }
        })

        const images = await this.firebaseService.findImages('/images/notices/' + id_usuarioAnuncio + "/" + id_anuncioTroca)

        return {
            ...notice,
            images
        }
    }

    async find(where: FindNoticeDTO, page?: number, take?: number, relations?: string) {
        const _relations = relations?.split(',')?.map(rel => ({[rel.trim()]: true})) || [];
        const {noticeDetails, category, user, userReview, userAddress} = Object.assign({noticeDetails: false, category: false, user: false, userReview: false, userAddress: false}, ..._relations)

        if (!page || (page - 1) < 0) {
            page = 0
        } else {
            page = page - 1
        }
        if (!take) take = 100

        const notices = await this.noticeRepository.find({
            where,
            take,
            skip: (page * take),
            relations: {
                noticeDetails,
                category,
                user: user ? {
                    userAddress,
                    userReview
                } : false
            }
        })

        const noticesFull = Promise.all(notices.map(async (notice) => {
            const images = await this.firebaseService.findImages('/images/notices/' + notice.id_usuarioAnuncio + "/" + notice.id_anuncioTroca)
            return {
                ...notice,
                images
            }
        }))

        return noticesFull
    }

    async create(id_usuarioAnuncio: number, notice: CreateNoticeDTO) {
        const response = await this.noticeRepository.save({...notice, id_usuarioAnuncio});

        return response
    }

    async createImages(images: Array<Express.Multer.File>, id_usuario: number, id_anuncioTroca: number) {
        const path = '/images/notices/' + id_usuario + '/' + id_anuncioTroca;

        const noticeExists = await this.findOne(id_anuncioTroca, id_usuario, '');
        if (!noticeExists) throw new HttpException('Este anúncio não existe!', 403);

        await this.firebaseService.createImages(images, path);
        return;
    }

    async update(id_anuncioTroca: number, id_usuarioAnuncio: number, notice: UpdateNoticeDTO) {
        const {noticeDetails, ..._notice} = notice;

        noticeDetails?.forEach(async (detail) => {
            const {id_detalheTroca, ...detailContent} = detail;

            await this.noticeDetailsRepository.update({
                id_anuncioTroca,
                id_usuarioAnuncio,
                id_detalheTroca
            }, detailContent)
        })

        return await this.noticeRepository.update({
            id_anuncioTroca,
            id_usuarioAnuncio
        }, _notice)
    }

    async updateImages(imagesInserted: Array<Express.Multer.File>, imagesRemoved: string[], id_usuario: number, id_anuncioTroca: number) {
        const path = '/images/notices/' + id_usuario + "/" + id_anuncioTroca;

        const noticeExists = await this.findOne(id_anuncioTroca, id_usuario, '');
        if (!noticeExists) throw new HttpException('Este anúncio não existe!', 403);

        if (imagesRemoved?.length > 0) {
            await Promise.all(imagesRemoved.map(async (image) => await this.firebaseService.deleteImage(image, path)));
        }

        if (imagesInserted?.length > 0) {
            await this.firebaseService.createImages(imagesInserted, path);
        }

        return;
    }

    async delete(id_anuncioTroca: number, id_usuarioAnuncio: number) {
        return await this.noticeRepository.delete({
            id_anuncioTroca,
            id_usuarioAnuncio
        })
    }
}