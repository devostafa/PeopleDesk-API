import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { EmpResponseDto } from '../data/dtos/responseDtos/empResponseDto';
import { CreateEmployeeRequestDto } from '../data/dtos/requestDtos/createEmployeeRequestDto';
import { UpdateEmployeeRequestDto } from '../data/dtos/requestDtos/updateEmployeeRequestDto';
import { JwtAuthGuard } from '../guards/jwtAuthGuard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../data/enums/userRole';
import { EmpService } from '../services/empService';

@ApiTags('Employees')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Roles(UserRole.ADMIN)
@Controller('employees')
export class EmployeeController {
  constructor(private readonly empService: EmpService) {}

  @Get()
  @ApiOperation({ summary: 'Get all employees' })
  @ApiResponse({ status: 200, type: [EmpResponseDto] })
  async getAll(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
    @Query('search') search?: string,
    @Query('sort') sort?: string,
  ): Promise<{ data: EmpResponseDto[]; total: number }> {
    return this.empService.getAll(page, limit, search, sort);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get employee by ID' })
  @ApiResponse({ status: 200, type: EmpResponseDto })
  async getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<EmpResponseDto> {
    return this.empService.getById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new employee' })
  @ApiResponse({ status: 201, type: EmpResponseDto })
  async create(@Body() dto: CreateEmployeeRequestDto): Promise<EmpResponseDto> {
    return this.empService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an employee' })
  @ApiResponse({ status: 200, type: EmpResponseDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEmployeeRequestDto,
  ): Promise<EmpResponseDto> {
    return this.empService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an employee' })
  @ApiResponse({ status: 200 })
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.empService.delete(id);
  }
}
