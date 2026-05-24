import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwtAuthGuard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../data/enums/userRole';
import { AnalyticsService } from '../services/analyticsService';

@ApiTags('Analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Roles(UserRole.ADMIN)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Get analytics summary' })
  async getSummary() {
    return this.analyticsService.getSummary();
  }
}
