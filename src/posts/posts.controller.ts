import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostEntity } from './entities/post.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RequestWithSession } from 'src/types/request.session';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Request() req: RequestWithSession,
    @Body() createPostDto: CreatePostDto,
  ): Promise<PostEntity> {
    console.log('req', req.user);
    const user = req.user;
    return await this.postsService.create({
      ...createPostDto,
      author: user.id,
    });
  }

  @Get()
  async findAll(): Promise<PostEntity[]> {
    return await this.postsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PostEntity> {
    return await this.postsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Request() req: RequestWithSession,
  ): Promise<PostEntity> {
    return await this.postsService.update(id, updatePostDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Request() req: RequestWithSession,
  ): Promise<PostEntity> {
    return await this.postsService.remove(id, req.user.id);
  }
}
