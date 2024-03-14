import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notice } from './entities/notice.entity';
import { NoticeDetails } from './entities/noticeDetails.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Notice, NoticeDetails])]
})
export class NoticeModule {}
