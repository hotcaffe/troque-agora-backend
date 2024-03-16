import { HttpModule } from "@nestjs/axios"
import { ConfigModule } from "@nestjs/config"
import { Test, TestingModule } from "@nestjs/testing"
import { TypeOrmModule } from "@nestjs/typeorm"
import { join, resolve } from "path"
import { Notice } from "../entities/notice.entity"
import { NoticeDetails } from "../entities/noticeDetails.entity"
import { NoticeService } from "../notice.service"

describe('NoticeService', () => {
    let service: NoticeService;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                HttpModule,
                ConfigModule.forRoot({envFilePath: resolve(__dirname, 'test.env')}),
                TypeOrmModule.forRoot({
                    type: 'postgres',
                    host: process.env.PG_HOST,
                    port: Number(process.env.PG_PORT),
                    database: process.env.PG_DATABASE,
                    username: process.env.PG_USER,
                    password: process.env.PG_PASSWORD,
                    entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
                    synchronize: true
                }),
                TypeOrmModule.forFeature([Notice, NoticeDetails])
            ],
            providers: [
                NoticeService
            ]
        }).compile();

        service = module.get<NoticeService>(NoticeService);
    });

    describe('Create a notice', () => {
        it("Should be possible to create a new notice", () => {

        })
    })
})