import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { decode } from 'jsonwebtoken';
import { Model } from 'mongoose';
import { Server, Socket } from 'socket.io';
import { Keycloak } from 'src/Services/keycloak/keycloak';
import { Chat } from 'src/modules/chat/schemas/chat.schema';
import { ProposalNotices } from 'src/modules/proposal/entities/proposalNotices.entity';
import { Repository } from 'typeorm';

interface IPrivateMessage {
  to: string;
  content: string;
}

@WebSocketGateway({
  cors: {
    origin: process.env.TA_CLIENT_WEB
  }
})
export class ChatGateway implements OnGatewayConnection {
  constructor(
    private readonly keycloak: Keycloak,
    @InjectRepository(ProposalNotices) private readonly proposalNoticesRepository: Repository<ProposalNotices>,
    @InjectModel(Chat.name) private readonly chatModel: Model<Chat>
  ) {}

  getCookies(cookies: string) {
    const cookiesString = cookies?.split(';');
    const cookiesSub = cookiesString?.map(cookie => cookie?.split('='));
    return Object.assign({}, ...cookiesSub?.map(([key, value]) => ({[key.trim()]: value.trim()})))
  }

  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {     
    const cookies = this.getCookies(client.request.headers.cookie);
    if (!cookies?.access_token) {
      client.emit('REVOKE_SESSION');
      client.disconnect();
      return;
    }
    const introspected_access_token = await this.keycloak.introspectToken(cookies.access_token);
    if (!introspected_access_token?.active){
      client.emit('REVOKE_SESSION');
      client.disconnect();
      return;
    }

    const id_usuario = introspected_access_token?.id_usuario;
    if (!id_usuario) {
      client.emit('REVOKE_SESSION');
      client.disconnect();
      return;
    };

    client.join(id_usuario);
  }

  @SubscribeMessage('private message')
  async handlePrivateMessage(@MessageBody() {to, content}: IPrivateMessage, @ConnectedSocket() client: Socket) {
    const cookies = this.getCookies(client.request.headers.cookie);
    const token = decode(cookies.access_token) as any;
    const id_usuario = token.id_usuario;

    const isAvailable = await this.proposalNoticesRepository.exist({
      where: [
        {
          id_usuarioAnuncio: Number(to)
        },
        {
          id_usuarioProposta: Number(to)
        }
      ]
    })

    if (!isAvailable) return;

    await this.chatModel.create({
      message: content,
      user_id: id_usuario,
      recipient_id: to
    })

    const message = {
      from: id_usuario,
      to: to,
      message: content
    }

    client.to(to).emit("private message", message);
  }
}
