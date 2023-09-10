import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class NewMessageChatRoomDto {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  chatRoomId: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  message: string;
}
