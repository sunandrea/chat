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
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RequestWithSession } from 'src/types/request.session';
import { Comment } from './entities/comment.entity';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':id')
  async create(
    @Request() req: RequestWithSession,
    @Body() createCommentDto: CreateCommentDto,
    @Param('id') id: string,
  ): Promise<Comment> {
    const user = req.user;
    return await this.commentsService.create({
      ...createCommentDto,
      postId: id,
      author: user.id,
    });
  }

  @Get(':id')
  async findAll(@Param('id') id: string): Promise<Comment[]> {
    return await this.commentsService.findAllCommentsOnPost(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Request() req: RequestWithSession,
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return await this.commentsService.update(id, updateCommentDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(
    @Request() req: RequestWithSession,
    @Param('id') id: string,
  ): Promise<Comment> {
    return await this.commentsService.remove(id, req.user.id);
  }
}
