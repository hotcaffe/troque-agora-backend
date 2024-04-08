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
  Header,
  Headers,
  UseInterceptors,
  UploadedFiles,
  ParseFilePipe,
  FileTypeValidator,
  ForbiddenException,
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
import { decode, sign, verify } from 'jsonwebtoken';
import * as crypto from 'crypto'
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(new ValidationPipe({transform: true,transformOptions: {excludeExtraneousValues: true}}))
  async create(@Body() User: CreateUserDto, @Body() UserPersonalData: CreateUserPersonalDataDto, @Body() UserAddress: CreateUserAddressDto) {
    return await this.userService.create(User, UserPersonalData, UserAddress);
  }

  @Post('/sign')
  @UsePipes(new ValidationPipe({transform: true, transformOptions: {excludeExtraneousValues: true}}))
  async sign(@Body() User: CreateUserDto, @Body() UserPersonalData: CreateUserPersonalDataDto, @Body() UserAddress: CreateUserAddressDto) {
    const body = {
      ...User,
      ...UserPersonalData,
      ...UserAddress
    }
    const buffer = Buffer.from(JSON.stringify(body));
    const encrypt = crypto.publicEncrypt(
      {
        key: process.env.TA_PUBLIC_KEY,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256'
      }, 
      buffer
    )?.toString('base64')

    const token = sign(encrypt, process.env.TA_PRIVATE_KEY, {algorithm: 'RS256'})

    return {token};
  }

  @Post('/complete')
  @UseInterceptors(FilesInterceptor('images'))
  @UsePipes(new ValidationPipe({transform: true, transformOptions: {excludeExtraneousValues: true}}))
  async complete(
    @Headers('Authorization') token: string,
    @UploadedFiles(
      new ParseFilePipe({
          validators: [
              new FileTypeValidator({fileType: 'image'})
          ]
      }),
    ) images: Array<Express.Multer.File>
  ) {
    const files = Object.assign({}, ...images?.map((image) => ({[image.originalname]: image}))?.flat())
    const {backImage, frontImage, face} = files;

    const isValid = this.userService.validateDocuments(backImage, frontImage) && this.userService.validateFace(face);

    if (!isValid) throw new ForbiddenException("Biometria e documentos inválidos!");

    const data = verify(token, process.env.TA_PUBLIC_KEY, {algorithms: ['RS256']});
    const buffer = Buffer.from(JSON.stringify(data), 'base64');
    const decrypt = crypto.privateDecrypt(
      {
        key: process.env.TA_PRIVATE_KEY,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256'
      },
      buffer
    )?.toString('utf-8')

    const {
      username, 
      password, 
      dt_nascimento, 
      in_celular,
      in_cpf,
      in_numero,
      vc_bairro,
      vc_cidade,
      vc_complemento,
      vc_email,
      vc_estado,
      vc_lougradouro,
      vc_nome
    } = JSON.parse(decrypt) as CreateUserDto & CreateUserAddressDto & CreateUserPersonalDataDto;
    

    await this.userService.create(
      {username, password}, 
      {dt_nascimento,in_celular,in_cpf,vc_email,vc_nome}, 
      {in_numero,vc_bairro,vc_cidade,vc_complemento,vc_estado,vc_lougradouro}
    )

    return await this.userService.login(username, password)
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
          
          const {id_usuario, name, preferred_username, email} = decode(access_token) as any;
          const user = {
            id_usuario, name, preferred_username, email
          }
          return user
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
      maxAge: -1,
      httpOnly: true
    })

    response.cookie('refresh_token', "", {
      maxAge: -1,
      httpOnly: true
    })
  }

  @Get('/me')
  @UseGuards(AuthGuard)
  async findMe(@Request() request: any) {
    const id_usuario = request.introspected_access_token.id_usuario as number;
    return await this.userService.findOne(id_usuario);
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
