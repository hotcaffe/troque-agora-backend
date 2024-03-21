import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, SetMetadata, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { FindCategoryDTO } from "./dto/find-category-dto";
import { AuthGuard } from "src/guards/auth.guard";
import { CreateCategoryDTO } from "./dto/create-category-dto";
import { UpdateCategoryDTO } from "./dto/update-category-dto";

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

    @Get(':id_categoria')
    async findOne(@Param('id_categoria', ParseIntPipe) id_categoria: number) {
        return await this.categoryService.findOne(id_categoria);
    }

    @Get()
    @UsePipes(new ValidationPipe(
        {transform: false, transformOptions: {excludeExtraneousValues: true}, skipMissingProperties: true, skipNullProperties: true, skipUndefinedProperties: true})
    )
    async find(@Query() where: FindCategoryDTO) {
        return await this.categoryService.find(where);
    }

    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe({transform: true, transformOptions: {excludeExtraneousValues: true}}))
    @SetMetadata('roles', ['rl_admin'])
    @Post()
    async create(@Body() category: CreateCategoryDTO) {
        return await this.categoryService.create(category);
    }

    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe({transform: true, transformOptions: {excludeExtraneousValues: true}, skipUndefinedProperties: true}))
    @SetMetadata('roles', ['rl_admin'])
    @Patch(":id_categoria")
    async update(
        @Param('id_categoria', ParseIntPipe) id_categoria: number, 
        @Body() category: UpdateCategoryDTO
    ) {
        return this.categoryService.update(id_categoria, category);
    }

    @UseGuards(AuthGuard)
    @SetMetadata('roles', ['rl_admin'])
    @Patch(":id_categoria")
    async delete(@Param('id_categoria', ParseIntPipe) id_categoria: number) {
        return this.categoryService.delete(id_categoria);
    }
}