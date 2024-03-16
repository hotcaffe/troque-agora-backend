import { Catch, HttpException, Injectable, Res } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { throwError } from "rxjs";
import { CustomErrorHandlerService } from "src/Services/utils/error-handler.service";
import { Notice } from "./entities/notice.entity";
import { Not, Repository } from "typeorm";
import { NoticeDetails } from "./entities/noticeDetails.entity";
import { CreateNoticeDTO } from "./dto/create-notice-dto";
import { CreateNoticeDetailsDTO } from "./dto/create-notice-details-dto";

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

    async create(notice: CreateNoticeDTO) {
        const response = await this.noticeRepository.save(notice);

        return response
    }
}