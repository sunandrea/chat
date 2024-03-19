import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMessageDto } from 'src/chat/dto/create-message.dto';
import { UpdateMessageDto } from 'src/chat/dto/update-message.dto';
import { Message } from 'src/chat/entities/message.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
  ) {}

  async findOne(id: string): Promise<Message> {
    const message = await this.messageModel.findById(id).exec();
    if (!message) throw new NotFoundException('Повідомлення не знайдено');

    return message;
  }
  async create(createMessageDto: CreateMessageDto): Promise<Message> {
    const createdMessage = new this.messageModel(createMessageDto);
    return await createdMessage.save();
  }

  async deleteForUser(id: string, userId: string): Promise<Message> {
    const message = await this.messageModel.findById(id);
    if (!message) throw new NotFoundException('Повідомлення не знайдено');

    message.deletedFor.push(userId);
    return await message.save();
  }

  async getMessagesForUser(
    recipientId: string,
    authorId: string,
  ): Promise<Message[]> {
    return await this.messageModel
      .find({
        recipient: recipientId,
        author: authorId,
        deletedFor: { $ne: authorId },
      })
      .exec();
  }

  async deleteForAll(id: string): Promise<Message> {
    return await this.messageModel.findByIdAndDelete(id);
  }

  async update(
    updateMessageDto: UpdateMessageDto,
    messageId: string,
    userId: string,
  ): Promise<Message> {
    const message = await this.findOne(messageId);

    if (message.author.toString() !== userId)
      throw new ForbiddenException(
        'У вас немає прав на редагування даного повідомлення',
      );

    return await this.messageModel
      .findByIdAndUpdate(messageId, updateMessageDto, { new: true })
      .exec();
  }
}
