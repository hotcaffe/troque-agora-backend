import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Notice } from "./entities/notice.entity";
import {  Repository } from "typeorm";
import { NoticeDetails } from "./entities/noticeDetails.entity";
import { CreateNoticeDTO } from "./dto/create-notice-dto";
import { FindNoticeDTO } from "./dto/find-notice-dto";
import { UpdateNoticeDTO } from "./dto/update-notice-dto";

@Injectable()
export class NoticeService {
    constructor(
        @InjectRepository(Notice) private readonly noticeRepository: Repository<Notice>,
        @InjectRepository(NoticeDetails) private readonly noticeDetailsRepository: Repository<NoticeDetails>
    ){}

    async findOne(id_anuncioTroca: number, id_usuarioAnuncio: number, relations: string) {
        const _relations = relations?.split(',')?.map(rel => ({[rel.trim()]: true})) || [];
        const {noticeDetails, category, user} = Object.assign({noticeDetails: false, category: false, user: false}, ..._relations)

        return await this.noticeRepository.findOne({
            where: {
                id_anuncioTroca,
                id_usuarioAnuncio
            },
            relations: {
                noticeDetails,
                category,
                user
            }
        })
    }

    async find(where: FindNoticeDTO, page?: number, take?: number, relations?: string) {
        const _relations = relations?.split(',')?.map(rel => ({[rel.trim()]: true})) || [];
        const {noticeDetails, category, user} = Object.assign({noticeDetails: false, category: false, user: false}, ..._relations)

        if (!page || (page - 1) < 0) {
            page = 0
        } else {
            page = page - 1
        }
        if (!take) take = 100

        return await this.noticeRepository.find({
            where,
            take,
            skip: (page * take),
            relations: {
                noticeDetails,
                category,
                user
            }
        })
    }

    async create(id_usuarioAnuncio: number, notice: CreateNoticeDTO) {
        const response = await this.noticeRepository.save({...notice, id_usuarioAnuncio});

        return response
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

    async delete(id_anuncioTroca: number, id_usuarioAnuncio: number) {
        return await this.noticeRepository.delete({
            id_anuncioTroca,
            id_usuarioAnuncio
        })
    }
}