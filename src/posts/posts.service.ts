import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostEntity } from './entities/post.entity';
import { CreatePostWithAuthorDto } from './dto/create-post-with-author.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(PostEntity.name) private postModel: Model<PostEntity>,
  ) {}

  async create(createPostDto: CreatePostWithAuthorDto): Promise<PostEntity> {
    const createdPost = new this.postModel(createPostDto);
    return await createdPost.save();
  }

  async findAll(): Promise<PostEntity[]> {
    return await this.postModel.find().exec();
  }

  async findOne(id: string): Promise<PostEntity> {
    const post = await this.postModel.findById(id).exec();
    if (!post) throw new NotFoundException('Пост не знайдено');
    return post;
  }

  async update(
    id: string,
    updatePostDto: UpdatePostDto,
    userId: string,
  ): Promise<PostEntity> {
    const post = await this.findOne(id);
    if (post.author.toString() !== userId)
      throw new ForbiddenException(
        'У вас немає прав на редагування даного поста',
      );

    return await this.postModel
      .findByIdAndUpdate(id, updatePostDto, { new: true })
      .exec();
  }

  async remove(id: string, userId: string): Promise<PostEntity> {
    const post = await this.findOne(id);
    console.log('post', post);
    if (post.author.toString() !== userId)
      throw new ForbiddenException(
        'У вас немає прав на редагування даного поста',
      );

    return await this.postModel.findByIdAndDelete(id).exec();
  }
}
