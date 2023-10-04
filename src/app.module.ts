import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/User/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import {  join } from 'path';
import {ConfigModule} from '@nestjs/config'

@Module({
  imports: [UserModule, ConfigModule.forRoot(), TypeOrmModule.forRoot({
    type: 'postgres',
    host: process.env.PG_HOST,
    port: Number(process.env.PG_PORT),
    database: process.env.PG_DATABASE,
    username: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    entities: [join(__dirname, '**', '*.entity.{ts,js}')],
    synchronize: true
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
