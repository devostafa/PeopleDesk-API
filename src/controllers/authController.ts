import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../services/authService';
import { LoginRequestDto } from '../data/dtos/requestDtos/loginRequestDto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login and receive a JWT access token' })
  @ApiResponse({ status: 200, description: 'Returns JWT access token' })
  @ApiResponse({ status: 401, description: 'Invalid account credentials' })
  async login(@Body() body: LoginRequestDto): Promise<{ accessToken: string }> {
    return this.authService.login(body.userName, body.password);
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout (client-side token invalidation)' })
  @ApiResponse({ status: 200 })
  async logOut(): Promise<void> {}
}
