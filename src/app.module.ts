import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {  join } from 'path';
import {ConfigModule} from '@nestjs/config'
import { Keycloak } from './Services/keycloak/keycloak';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { UserModule } from './modules/user/user.module';
import { NoticeModule } from './Modules/notice/notice.module';
import { CategoryModule } from './Modules/category/category.module';
import { ProposalModule } from './Modules/proposal/proposal.module';
import { ChatGateway } from './gateways/chat/chat.gateway';
import { ChatModule } from './modules/chat/chat.module';
import { MongooseModule } from '@nestjs/mongoose';
import { FirebaseModule } from './modules/firebase/firebase.module';

@Module({
  imports: [
      ConfigModule.forRoot(),
      UserModule, 
      CategoryModule, 
      NoticeModule, 
      ProposalModule,
      HttpModule, 
      CacheModule.register(), 
      TypeOrmModule.forRoot({
        type: 'postgres',
        host: process.env.PG_HOST,
        port: Number(process.env.PG_PORT),
        database: process.env.PG_DATABASE,
        username: process.env.PG_USER,
        password: process.env.PG_PASSWORD,
        entities: [join(__dirname, '**', '*.entity.{ts,js}')],
        synchronize: true,
        autoLoadEntities: true,
      }), 
      MongooseModule.forRoot(process.env.MONGO_URI, {
        auth: {
          username: process.env.MONGO_USER,
          password: process.env.MONGO_PASSWORD
        }
      }),
      ChatModule,
      // FirebaseModule
  ],
  controllers: [AppController],
  providers: [AppService, Keycloak],
})
export class AppModule {}
