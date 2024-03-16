import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notice } from './entities/notice.entity';
import { NoticeDetails } from './entities/noticeDetails.entity';
import { NoticeController } from './notice.controller';
import { NoticeService } from './notice.service';
import { User } from '../user/entities/user.entity';
import { UserAddress } from '../user/entities/userAddress.entity';
import { UserReview } from '../user/entities/userReview.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Notice, NoticeDetails, User, UserAddress, UserReview])],
    controllers: [NoticeController],
    providers: [NoticeService]
})
export class NoticeModule {
}
