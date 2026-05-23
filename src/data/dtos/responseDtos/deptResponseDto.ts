import { ApiProperty } from '@nestjs/swagger';

export class DeptResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;
}
