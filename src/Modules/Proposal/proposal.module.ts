import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proposal } from './entities/proposal.entity';
import { ProposalItem } from './entities/proposalItem.entity';
import { ProposalNotices } from './entities/proposalNotices.entity';
import { ProposalController } from './proposal.controller';
import { ProposalService } from './proposal.service';
import { Keycloak } from 'src/Services/keycloak/keycloak';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { UserReview } from '../user/entities/userReview.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Proposal, ProposalItem, ProposalNotices, UserReview]), HttpModule, CacheModule.register()],
    controllers: [ProposalController],
    providers: [ProposalService, Keycloak]
})
export class ProposalModule {}
