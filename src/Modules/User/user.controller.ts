import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  Query,
  ParseIntPipe,
  Res,
  UseGuards,
  SetMetadata,
  Patch,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUserAddressDto } from './dto/create-user-address-dto';
import { CreateUserPersonalDataDto } from './dto/create-user-personal.dto';
import { QueryRequired } from 'src/Decorators/query-required/query-required.decorator';
import {Response} from 'express';
import { Cookies } from 'src/Decorators/cookies/cookies.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { UpdateUserDTO } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(new ValidationPipe({transform: true,transformOptions: {excludeExtraneousValues: true}}))
  async create(@Body() User: CreateUserDto, @Body() UserPersonalData: CreateUserPersonalDataDto, @Body() UserAddress: CreateUserAddressDto) {
    return await this.userService.create(User, UserPersonalData, UserAddress);
  }

  @Get('/list')
  findAll(@Query('page') page: number) {
    return this.userService.findAll(page);
  }

  @Get('/login')
  async login(
    @Cookies('refresh_token') refresh_token_cookie: string,
    @QueryRequired('username') username: string, 
    @QueryRequired('password') password: string, 
    @Res({passthrough: true}) response: Response
  ) {

    if (refresh_token_cookie) {
      const {access_token: new_access_token, refresh_token: new_refresh_token} = await this.userService.refreshSession(refresh_token_cookie)
  
      if (new_access_token && new_refresh_token) {
        response.cookie('access_token', new_access_token, {
          httpOnly: true
        })
        response.cookie('refresh_token', new_refresh_token, {
          httpOnly: true
        })
  
        return;
      }
    }

    const {access_token, refresh_token} = await this.userService.login(username, password)
    
    if (access_token && refresh_token) {
          response.cookie('access_token', access_token, {
            httpOnly: true
          })
          response.cookie('refresh_token', refresh_token, {
            httpOnly: true
          })
          
          return;
    }

    response.cookie('access_token', "", {
      maxAge: -1
    })

    response.cookie('refresh_token', "", {
      maxAge: -1
    })
  }

  @Get('/logout')
  async logout(@Cookies('access_token') access_token: string, @Res({passthrough: true}) response: Response) {
    await this.userService.logout(access_token);
    response.cookie('access_token', "", {
      maxAge: -1
    })

    response.cookie('refresh_token', "", {
      maxAge: -1
    })
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.findOne(id);
  }

  @Get()
  findByUsername(@QueryRequired('username') username: string) {
    return this.userService.findOneByUsername(username)
  }

  @Patch("/reset-password")
  @UseGuards(AuthGuard)
  updatePassword(
    @Request() request: any, 
    @Body('password') password: string
  ) {
    const id_usuario = request.introspected_access_token.id_usuario as number;
    const username = request.introspected_access_token.preferred_username as string;
    return this.userService.updatePassword(id_usuario, username, password);
  }

  @Patch(':id_usuario')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({transform: true, transformOptions: {excludeExtraneousValues: true}, skipUndefinedProperties: true}))
  @SetMetadata('roles', ['rl_admin'])
  update(@Param('id_usuario') id_usuario: number, @Body() user: UpdateUserDTO) {
    return this.userService.update(+id_usuario, user);
  }

  @Patch()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({transform: true, transformOptions: {excludeExtraneousValues: true}, skipUndefinedProperties: true}))
  updateSelf(
    @Request() request: any, 
    @Body() user: UpdateUserDTO
  ) {
    const id_usuario = request.introspected_access_token.id_usuario as number;
    return this.userService.update(+id_usuario, user);
  }

  @UseGuards(AuthGuard)
  @SetMetadata('roles', ['rl_admin'])
  @Delete(':username')
  remove(@Param('username') username: string) {
    return this.userService.remove(username);
  }
}
