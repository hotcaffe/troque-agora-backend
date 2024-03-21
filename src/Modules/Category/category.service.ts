import { Injectable } from "@nestjs/common";
import { Notice } from "../notice/entities/notice.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "./entities/category.entity";
import { FindCategoryDTO } from "./dto/find-category-dto";
import { CreateCategoryDTO } from "./dto/create-category-dto";
import { UpdateCategoryDTO } from "./dto/update-category-dto";

@Injectable()
export class CategoryService {
  constructor(@InjectRepository(Category) private readonly categoryRepository: Repository<Category>){}

  async findOne(id_categoria: number) {
    return await this.categoryRepository.findOne({
        where: {
            id_categoria
        }
    });
  }

  async find(where: FindCategoryDTO) {
    return await this.categoryRepository.find({
        where
    })
  }

  async create(category: CreateCategoryDTO) {
    return await this.categoryRepository.save(category)
  }

  async update(id_categoria: number, category: UpdateCategoryDTO) {
    return await this.categoryRepository.update(id_categoria, category)
  }

  async delete(id_categoria: number) {
    return await this.categoryRepository.delete({id_categoria})
  }
}