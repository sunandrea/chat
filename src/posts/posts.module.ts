import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PostEntity, PostSchema } from './entities/post.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: PostEntity.name, schema: PostSchema }]),
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
