import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proposal } from './entities/proposal.entity';
import { ProposalItem } from './entities/proposalItem.entity';
import { ProposalNotices } from './entities/proposalNotices.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Proposal, ProposalItem, ProposalNotices])]
})
export class ProposalModule {}
