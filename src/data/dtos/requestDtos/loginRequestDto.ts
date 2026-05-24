import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userName!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(72) // bcrypt silently truncates beyond 72 bytes
  password!: string;
}
