import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../services/authService';
import { LoginRequestDto } from '../data/dtos/requestDtos/loginRequestDto';

import * as express from 'express';
import { SkipThrottle, Throttle } from '@nestjs/throttler';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Login and receive a JWT access token' })
  @ApiResponse({ status: 200, description: 'Returns JWT access token' })
  @ApiResponse({ status: 401, description: 'Invalid account credentials' })
  async login(
    @Body() body: LoginRequestDto,
    @Res({ passthrough: true }) response: express.Response,
  ): Promise<{ accessToken: string }> {
    const { accessToken, refreshToken } = await this.authService.login(
      body.userName,
      body.password,
    );

    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { accessToken };
  }

  @Post('refresh')
  @SkipThrottle()
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Returns new access token' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refresh(
    @Req() request: express.Request,
    @Res({ passthrough: true }) response: express.Response,
  ): Promise<{ accessToken: string }> {
    const refreshToken = request.cookies['refreshToken'] as string;
    if (!refreshToken)
      throw new UnauthorizedException('Refresh token not found');

    const { accessToken, refreshToken: newRefreshToken } =
      await this.authService.refresh(refreshToken);

    response.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { accessToken };
  }

  @Post('logout')
  @SkipThrottle()
  @ApiOperation({ summary: 'Logout' })
  @ApiResponse({ status: 200 })
  async logOut(
    @Req() request: express.Request,
    @Res({ passthrough: true }) response: express.Response,
  ): Promise<void> {
    const refreshToken = request.cookies['refreshToken'] as string;
    if (refreshToken) await this.authService.revokeRefreshToken(refreshToken);
    response.clearCookie('refreshToken', { path: '/' });
  }
}
