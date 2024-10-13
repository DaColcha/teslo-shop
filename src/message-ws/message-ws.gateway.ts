import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessageWsService } from './message-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dto/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces';

@WebSocketGateway({ cors: true, namespace: '/' })
export class MessageWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wss: Server;

  constructor(

    private readonly messageWsService: MessageWsService,

    private readonly jwtService: JwtService

  ) {}

  async handleConnection(client: Socket) {

    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify(token);
      await this.messageWsService.registerClient(client, payload.id);

    } catch (error) {
      client.disconnect();
      return;
    }

    this.wss.emit('connectedClients', this.messageWsService.getConnectedClients());
  }

  handleDisconnect(client: Socket) {
    this.messageWsService.removeClient(client);
    this.wss.emit('connectedClients', this.messageWsService.getConnectedClients());

  }

  @SubscribeMessage('message-client')
  handleMessage( client: Socket, payload: NewMessageDto ) {
    
    //! Emite solamente al cliente que envió el mensaje
    // client.emit('message-history', {
    //   message: payload.message || 'No message',
    //   sender: client.id
    // });

    //! Emite a todos los clientes conectados menos el cliente 
    // client.broadcast.emit('message-history', {
    //   message: payload.message || 'No message',
    //   sender: client.id
    // });

    //! Emite a todos los clientes conectados
    this.wss.emit('message-history', {
      message: payload.message || 'No message',
      sender: this.messageWsService.getUserName(client.id)
    });

  }
}
