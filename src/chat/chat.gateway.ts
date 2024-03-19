import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';

import { Socket } from 'socket.io';

import { Req, UseFilters, UseGuards } from '@nestjs/common';
import { WebsocketExceptionFilter } from './ws-exception.filter';
import { ChatService } from './chat.service';
import { WsJwtGuard } from 'src/auth/guards/ws.jwt.guard';
import { RequestWithSession } from 'src/types/request.session';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
})
@UseFilters(new WebsocketExceptionFilter())
export class ChatGateway {
  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, room: string) {
    console.log('joinRoom', room);
    client.join(room);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, room: string) {
    client.leave(room);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('chatMessage')
  async handleChatMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    {
      room,
      message,
      recipient,
    }: { room: string; message: string; recipient: string },
    @Req() req: RequestWithSession,
  ) {
    if (client && client.connected) {
      client.join(room);
      const dbMessage = {
        text: message,
        author: req.user.id,
        recipient,
      };

      await this.chatService.create(dbMessage);

      client.to(room).emit('chatMessage', message);
    }
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('getMessages')
  async handleGetMessages(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    { recipient }: { recipient: string },
    @Req() req: RequestWithSession,
  ) {
    if (client && client.connected) {
      const messages = await this.chatService.getMessagesForUser(
        recipient,
        req.user.id,
      );

      client.emit('getMessages', messages);
    }
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('updateMessage')
  async handleUpdateMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    { text: updateMessageDto, messageId }: { text: string; messageId: string },
    @Req() req: RequestWithSession,
  ) {
    if (client && client.connected) {
      const message = await this.chatService.update(
        { text: updateMessageDto },
        messageId,
        req.user.id,
      );
      client.emit('updateMessage', message);
    }
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('deleteForUser')
  async handleDeleteForUser(
    @ConnectedSocket() client: Socket,
    @MessageBody() { messageId }: { messageId: string },
    @Req() req: RequestWithSession,
  ) {
    if (client && client.connected) {
      const message = await this.chatService.deleteForUser(
        messageId,
        req.user.id,
      );
      client.emit('deleteForUser', message);
    }
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('deleteForAll')
  async handleDeleteForAll(
    @ConnectedSocket() client: Socket,
    @MessageBody() { messageId }: { messageId: string },
  ) {
    if (client && client.connected) {
      const message = await this.chatService.deleteForAll(messageId);
      client.emit('deleteForAll', message);
    }
  }
}
