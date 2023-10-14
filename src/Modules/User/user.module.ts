import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserAddress } from './entities/userAddress.entity';
import { UserReview } from './entities/userReview.entity';
import { HttpModule } from '@nestjs/axios';
import { Keycloak } from 'src/Services/keycloak/keycloak';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserAddress, UserReview]), HttpModule, CacheModule.register()],
  controllers: [UserController],
  providers: [UserService, Keycloak],
})
export class UserModule {}
