import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateEmployeeRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty({ example: '2024-01-15' })
  @IsDateString()
  hireDate!: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  salary!: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  departmentId?: string;
}
