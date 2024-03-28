import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProposalNotices } from '../proposal/entities/proposalNotices.entity';
import { Keycloak } from 'src/Services/keycloak/keycloak';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatSchema, Chat } from './schemas/chat.schema';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [ChatController],
  providers: [ChatService, Keycloak],
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([ProposalNotices]), 
    HttpModule, 
    CacheModule.register(),
    MongooseModule.forFeature([{name: Chat.name, schema: ChatSchema}])
  ]
})
export class ChatModule {}
