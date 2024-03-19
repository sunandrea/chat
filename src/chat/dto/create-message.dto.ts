import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty()
  @IsString()
  text: string;

  @ApiProperty()
  @IsString()
  author: string;

  @ApiProperty()
  @IsString()
  recipient: string;
}
