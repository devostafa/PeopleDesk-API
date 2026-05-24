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
import { DeptResponseDto } from '../data/dtos/responseDtos/deptResponseDto';
import { CreateDepartmentRequestDto } from '../data/dtos/requestDtos/createDepartmentRequestDto';
import { UpdateDepartmentRequestDto } from '../data/dtos/requestDtos/updateDepartmentRequestDto';
import { JwtAuthGuard } from '../guards/jwtAuthGuard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../data/enums/userRole';
import { DeptService } from '../services/deptService';

@ApiTags('Departments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Roles(UserRole.ADMIN)
@Controller('departments')
export class DepartmentController {
  constructor(private readonly deptService: DeptService) {}

  @Get()
  @ApiOperation({ summary: 'Get all departments' })
  @ApiResponse({ status: 200, type: [DeptResponseDto] })
  async getAll(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
    @Query('search') search?: string,
    @Query('sort') sort?: string,
  ): Promise<{ data: DeptResponseDto[]; total: number }> {
    return this.deptService.getAll(page, limit, search, sort);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get department by ID' })
  @ApiResponse({ status: 200, type: DeptResponseDto })
  async getById(@Param('id') id: string): Promise<DeptResponseDto> {
    return this.deptService.getById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new department' })
  @ApiResponse({ status: 201, type: DeptResponseDto })
  async create(
    @Body() dto: CreateDepartmentRequestDto,
  ): Promise<DeptResponseDto> {
    return this.deptService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a department' })
  @ApiResponse({ status: 200, type: DeptResponseDto })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateDepartmentRequestDto,
  ): Promise<DeptResponseDto> {
    return this.deptService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a department' })
  @ApiResponse({ status: 200 })
  async delete(@Param('id') id: string): Promise<void> {
    await this.deptService.delete(id);
  }
}
