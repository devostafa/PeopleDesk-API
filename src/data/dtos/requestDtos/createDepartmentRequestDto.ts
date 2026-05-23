import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDepartmentRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
}
