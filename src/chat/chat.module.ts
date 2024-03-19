import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './entities/message.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
  ],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
