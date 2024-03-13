import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/User/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import {  join } from 'path';
import {ConfigModule} from '@nestjs/config'
import { Keycloak } from './Services/keycloak/keycloak';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { NoticeModule } from './Modules/Notice/notice.module';
import { CategoryModule } from './Modules/Category/category.module';
import { ProposalModule } from './Modules/Proposal/proposal.module';

@Module({
  imports: [UserModule, HttpModule, CacheModule.register(), ConfigModule.forRoot(), TypeOrmModule.forRoot({
    type: 'postgres',
    host: process.env.PG_HOST,
    port: Number(process.env.PG_PORT),
    database: process.env.PG_DATABASE,
    username: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    entities: [join(__dirname, '**', '*.entity.{ts,js}')],
    synchronize: true
  }), NoticeModule, CategoryModule, ProposalModule],
  controllers: [AppController],
  providers: [AppService, Keycloak],
})
export class AppModule {}
