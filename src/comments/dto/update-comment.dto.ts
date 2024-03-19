import { PartialType } from '@nestjs/mapped-types';
import { CreateCommentDto } from './create-comment.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateCommentDto extends PartialType(CreateCommentDto) {
  @ApiProperty()
  @IsString()
  text: string;
}
