import { HttpException, HttpStatus, Injectable, Inject } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserAddress } from './entities/userAddress.entity';
import { UserReview } from './entities/userReview.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(UserAddress) private readonly userAddressRepository: Repository<UserAddress>,
    @InjectRepository(UserReview) private readonly userReviewRepository: Repository<UserReview>
  ){}

  login({username, password}: CreateUserDto) {
    if (!(username && password)) {
      throw new HttpException("Usuário e senha devem ser informados!", HttpStatus.BAD_REQUEST);
    }
    return 'This action adds a new user';
  }

  async create({username, password}: CreateUserDto) {
    // this.userReviewRepository.insert({
    //   id_usuario: 3
    // })
    // this.userAddressRepository.insert({
    //   id_usuario: 1,
    //   in_numero: 5,
    //   vc_bairro: 'Centro',
    //   vc_complemento: 'Em frente o X',
    //   vc_estado: 'Paraná',
    //   vc_cidade: 'Mandaguari',
    //   vc_lougradouro: 'Rua talhe'
    // })
    // this.userRepository.insert({
    //   in_celular: 44997621072,
    //   in_cpf: 11843781930,
    //   in_idade: 22,
    //   vc_email: 'raphaelfusco@gmail.com',
    //   vc_nome: 'Raphael'
    // })
    const test = await this.userRepository.find({
      where: {
        id_usuario: 3
      },
      relations: {
        userAddress: true,
        userReview: true
      }
    })
    return test
  }
  

  findAll() {
    return [{}];
  }

  findOne(username: string) {
    return `This action returns a #${username} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
