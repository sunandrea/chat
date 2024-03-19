import { PartialType } from '@nestjs/mapped-types';
import { CreateMessageDto } from './create-message.dto';
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMessageDto extends PartialType(CreateMessageDto) {
  @ApiProperty()
  @IsString()
  text: string;
}
