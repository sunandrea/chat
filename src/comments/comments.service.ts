import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentDtoWithAuthor } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from './entities/comment.entity';
import { Model } from 'mongoose';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
  ) {}
  async create(createCommentDto: CreateCommentDtoWithAuthor): Promise<Comment> {
    const comment = new this.commentModel(createCommentDto);
    return await comment.save();
  }

  async findAllCommentsOnPost(postId: string): Promise<Comment[]> {
    return await this.commentModel
      .find({ postId: postId })
      .sort({ createdAt: -1 });
  }

  async findOne(id: string): Promise<Comment> {
    const comment = await this.commentModel.findById(id);
    if (!comment) throw new NotFoundException('Коментар не знайдено');

    return comment;
  }

  async update(
    id: string,
    updateCommentDto: UpdateCommentDto,
    userId: string,
  ): Promise<Comment> {
    const comment = await this.findOne(id);
    console.log(`comment.author.toString()`, comment.author.toString());
    console.log(`userId`, userId);

    if (comment.author.toString() !== userId)
      throw new ForbiddenException(
        'У вас немає прав на редагування даного коментаря',
      );
    return await this.commentModel
      .findByIdAndUpdate(id, updateCommentDto, {
        new: true,
      })
      .exec();
  }

  async remove(id: string, userId: string): Promise<Comment> {
    const comment = await this.findOne(id);
    if (comment.author.toString() !== userId)
      throw new ForbiddenException(
        'У вас немає прав на видалення даного коментаря',
      );

    return await this.commentModel.findByIdAndDelete(id).exec();
  }
}
