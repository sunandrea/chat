import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty()
  @IsString()
  text: string;
}

export class CreateCommentDtoWithAuthor extends CreateCommentDto {
  @ApiProperty()
  @IsString()
  author: string;

  @ApiProperty()
  @IsString()
  postId: string;
}
