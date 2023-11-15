import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  Query,
  ParseIntPipe,
  Header,
  Headers,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserAddress } from './entities/userAddress.entity';
import { CreateUserAddressDto } from './dto/create-user-address-dto';
import { CreateUserPersonalDataDto } from './dto/create-user-personal.dto';
import { IsNotEmpty } from 'class-validator';
import { QueryRequired } from 'src/Decorators/query-required/query-required.decorator';
import {Response} from 'express';
import { Cookies } from 'src/Decorators/cookies/cookies.decorator';

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

  // @Patch(':id')
  // update(@Param('id') id_usuario: number, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }

  @Delete(':username')
  remove(@Param('username') username: string) {
    return this.userService.remove(username);
  }
}
