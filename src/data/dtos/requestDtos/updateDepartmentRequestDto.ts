import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateDepartmentRequestDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;
}
