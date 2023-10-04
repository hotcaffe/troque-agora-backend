import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserAddress } from './entities/userAddress.entity';
import { UserReview } from './entities/userReview.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserAddress, UserReview])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
