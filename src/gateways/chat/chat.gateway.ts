import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: process.env.TA_CLIENT_WEB
  }
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('events')
  handleEvent(@MessageBody() data: string, @ConnectedSocket() client: Socket): string {
    console.log(data, client.request.headers.cookie)
    return 'Hello world!';
  }

  @SubscribeMessage('private message')
  handlePrivateMessage(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    console.log(data)
  }
}
