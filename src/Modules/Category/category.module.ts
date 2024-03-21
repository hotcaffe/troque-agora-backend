import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { Keycloak } from 'src/Services/keycloak/keycloak';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
    imports: [TypeOrmModule.forFeature([Category]), HttpModule, CacheModule.register() ],
    providers: [CategoryService, Keycloak],
    controllers: [CategoryController]
})
export class CategoryModule {}
