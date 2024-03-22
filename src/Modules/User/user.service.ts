import { HttpException, HttpStatus, Injectable, Inject, NotFoundException, Res, ForbiddenException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import {  Repository } from 'typeorm';
import { UserAddress } from './entities/userAddress.entity';
import { UserReview } from './entities/userReview.entity';
import { Keycloak } from '../../Services/keycloak/keycloak';
import {decode} from 'jsonwebtoken'
import { UpdateUserDTO } from './dto/update-user.dto';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(UserAddress) private readonly userAddressRepository: Repository<UserAddress>,
    @InjectRepository(UserReview) private readonly userReviewRepository: Repository<UserReview>,
    private keycloakService: Keycloak
  ){}

  errorHandler(error: any) {
    if (error instanceof HttpException) throw error
    const message = error.response?.data || error
    const status = error.response?.status || 500;
    throw new HttpException(message, status)
  }

  validaCPF(cpf: string) {
    if (cpf?.length != 11) return false;
    if (cpf === '00000000000') return false;

    const cpfArray = cpf.split("").map(digit => Number(digit));
    const nineDigitsSum = cpfArray.slice(0, 9).reduce((oldDigit, curDigit, index) => {
      const multiplier = 10 - index;
      if (index === 1) return (oldDigit * 10) + (curDigit * multiplier)
      return oldDigit + (curDigit * multiplier)
    })
    const nineDigitsMod = ((nineDigitsSum * 10) % 11);
    const firstVerifyDigit = nineDigitsMod === 10 ? cpfArray[9] === 0 : nineDigitsMod === cpfArray[9];
    
    if (firstVerifyDigit) {
      const tenDigitsSum = cpfArray.slice(0, 10).reduce((oldDigit, curDigit, index) => {
        const multiplier = 11 - index;
        if (index === 1) return (oldDigit * 11) + (curDigit * multiplier)
        return oldDigit + (curDigit * multiplier)
      })
      const tenDigitsMod = ((tenDigitsSum * 10) % 11);
      const secondVerifyDigit = tenDigitsMod === 10 ? cpfArray[10] === 0 : tenDigitsMod === cpfArray[10];

      return secondVerifyDigit;
    }

    return false;
  }

  async login(username: string, password: string): Promise<{access_token: string; refresh_token: string}> {
    try {
      return await this.keycloakService.loginUser(username, password);
    } catch (error) {
      const message = error.response.data?.error_description;
      if (message == 'Account is not fully set up') {
        throw new HttpException("Antes de realizar o login, por favor, verifique seu e-mail!", HttpStatus.UNAUTHORIZED);
      } else if (message == 'Invalid user credentials') {
        throw new HttpException("Usuário ou senha incorretos!", HttpStatus.UNAUTHORIZED);
      } 

      const status = error.response?.status || 500;
      if (status === 400 || status === 401) {
        return {access_token: "", refresh_token: ""}
      }
      this.errorHandler(error)
    }
  }

  async refreshSession(refresh_token: string) {
    try {
      return await this.keycloakService.refreshUserSession(refresh_token);
    } catch (error) {
      const status = error.response?.status || 500;
      if (status === 400 || status === 401) {
        return {access_token: "", refresh_token: ""}
      }
      this.errorHandler(error)
    }
  }

  async logout(access_token: string) {
    if (!access_token) return;
    try {
      const {session_state} = decode(access_token) as any;
      return await this.keycloakService.logoutUser(session_state)
    } catch (error) {
      const status = error.response?.status || 500;
      console.log(error)
      if (status === 400 || status === 401) {
        return {access_token: "", refresh_token: ""}
      }
      this.errorHandler(error)
    }
  }

  async create({username, password}: CreateUserDto, UserPersonalData: User, UserAddress: UserAddress, ) {
    if (username?.length < 6) throw new ForbiddenException("O nome de usuário deve ter ou ser maior que 6 caracteres")

    if(!this.validaCPF(String(UserPersonalData?.in_cpf))) throw new ForbiddenException("O CPF do usuário é inválido!")

    try {
      const cpfAlreadyExists = await this.userRepository.find({
        where: {
          in_cpf: UserPersonalData.in_cpf
        }
      }).then(users => !!users.length);

      if (cpfAlreadyExists) throw new ForbiddenException("O CPF do usuário já está cadastrado em outra conta!")

      await this.keycloakService.createUser(UserPersonalData.vc_nome, UserPersonalData.vc_email, username, password);
      
      const {id_usuario} = await this.userRepository.insert(UserPersonalData)?.then(res => res?.identifiers[0])
      if (!id_usuario) throw Error("Não foi possível criar o usuário!")
      await this.userAddressRepository.insert({...UserAddress, id_usuario})
      await this.userReviewRepository.insert({id_usuario})
      await this.keycloakService.updateUserAttributes(username, {id_usuario})
      await this.keycloakService.sendVerifyEmail(username);
      return;
    } catch (error: any) {
      this.errorHandler(error);
    }

  }
  
  async updateAvaliacaoGeral(id_usuario: number) {
    try {
      const userReview = await this.userReviewRepository.findOne({
        where: {
          id_usuario
        }
      })

      if (!userReview) throw new NotFoundException("User not found!")

      const newAvaliacaoGeral = userReview.qt_trocasAceitas ? userReview.qt_trocasSucedidas / userReview.qt_trocasAceitas : 0;

      await this.userReviewRepository.update(
        {
          id_usuario
        },
        {
          tx_avaliacaoGeral: newAvaliacaoGeral
        }
      )
    } catch (error) {
      this.errorHandler(error)
    }
  }

  async findAll(page?: number) {
    try {
      if (page) {
        const take = 20;
        const skip = (page - 1) * take;
        return await this.userRepository.find({
          relations: {
            userAddress: true,
            userReview: true
          },
          take,
          skip
        });
      } else {
        return await this.userRepository.find({
          relations: {
            userAddress: true,
            userReview: true
          }
        });
      }
    } catch (error) {
      this.errorHandler(error)
    }
  }

  async findOne(id_usuario: number) {
    try {
      return await this.userRepository.findOne({
        where: {
          id_usuario
        },
        relations: {
          userAddress: true,
          userReview: true
        }
      })
    } catch (error) {
      this.errorHandler(error);
    }
  }

  async findOneByUsername(username: string) {
    try {
      const id_usuario = await this.keycloakService.findUser(username).then(res => res?.attributes?.id_usuario[0]);
      if (!id_usuario) throw new NotFoundException("Usuário não encontrado!");
      return await this.userRepository.findOne({
        where: {
          id_usuario
        },
        relations: {
          userAddress: true,
          userReview: true
        }
      })
    } catch (error) {
      this.errorHandler(error);
    }
  }

  async update(id_usuario: number, user: UpdateUserDTO) {
    const {userAddress, ..._user} = user;
    await this.userAddressRepository.update({id_usuario}, userAddress);
    return await this.userRepository.update({id_usuario}, _user);
  }

  async updatePassword(id_usuario: number, username: string, password: string) {
    await this.keycloakService.resetPassword(username)
  }

  async remove(username: string) {
    try {
      const {keycloakID, id_usuario} = await this.keycloakService.findUser(username).then(res => ({keycloakID: res?.id, id_usuario: res?.attributes?.id_usuario[0]}));
      if (!keycloakID && !id_usuario) throw new NotFoundException("Usuário não encontrado!");
      if (id_usuario) {
        await this.userAddressRepository.delete({
          id_usuario: id_usuario
        })
        await this.userReviewRepository.delete({
          id_usuario: id_usuario
        })
        await this.userRepository.delete({
          id_usuario: id_usuario
        })
      }
      if (keycloakID) {
        await this.keycloakService.deleteUser(keycloakID);
      }
      return;
    } catch (error) {
      this.errorHandler(error)
    }
  }
}
