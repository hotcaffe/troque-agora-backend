import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proposal } from './entities/proposal.entity';
import { ProposalItem } from './entities/proposalItem.entity';
import { ProposalNotices } from './entities/proposalNotices.entity';
import { User } from '../user/entities/user.entity';
import { UserAddress } from '../user/entities/userAddress.entity';
import { UserReview } from '../user/entities/userReview.entity';
import { Category } from '../category/entities/category.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Proposal, ProposalItem, ProposalNotices])]
})
export class ProposalModule {}