import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreatePostWithAuthorDto {
  @ApiProperty()
  @IsString()
  text: string;

  @ApiProperty()
  @IsString()
  author: string;
}
