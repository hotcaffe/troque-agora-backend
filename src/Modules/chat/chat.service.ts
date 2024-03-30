import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ProposalNotices } from '../proposal/entities/proposalNotices.entity';
import { removeDuplicates } from 'src/services/utils/remove-duplicates';
import { Chat } from './schemas/chat.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/entities/user.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ProposalNotices) private readonly proposalNoticesRepository: Repository<ProposalNotices>,
    @InjectModel(Chat.name) private readonly chatModel: Model<Chat>
  ) {}

  create(createChatDto: CreateChatDto) {
    this.chatModel.create({
      message: 'Testola',
      recipient_id: '1',
      user_id: '2'
    })
    return 'This action adds a new chat';
  }

  async findAll(id_usuario: number) {
    const proposalNotices = await this.proposalNoticesRepository.find({
      where: [
        {id_usuarioAnuncio: id_usuario, vc_status: In(['accepted', 'finished'])},
        {id_usuarioProposta: id_usuario, vc_status: In(['accepted', 'finished'])}
      ],
      relations: {
        notice: {
          user: true
        },
        proposal: {
          user: true
        }
      }
    });

    const users = proposalNotices.map(pN => {
      if (id_usuario == pN.id_usuarioAnuncio) {
        return pN.proposal.user
      } else {
        return pN.notice.user
      }
    });

    
    const treatedUsers = removeDuplicates(users, ['id_usuario']) as User[];

    const conversations = Promise.all(treatedUsers.map(async (user) => {
      const chat = await this.chatModel.find({
        $or: [
          {user_id: user.id_usuario},
          {recipient_id: user.id_usuario}
        ]
      }).sort({timestamp: 1})
      
      return {
        ...user,
        conversations: chat
      }
    }));

    return conversations;
  }

  findOne(id: number) {
    return `This action returns a #${id} chat`;
  }

  update(id: number, updateChatDto: UpdateChatDto) {
    return `This action updates a #${id} chat`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}
