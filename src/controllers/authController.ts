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
import { JwtService } from '../services/jwtService';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('login')
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
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Returns new access token' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  refresh(
    @Req() request: express.Request,
    @Res({ passthrough: true }) response: express.Response,
  ): { accessToken: string } {
    const refreshToken = request.cookies['refreshToken'];
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    try {
      const payload = this.jwtService.verifyRefreshToken(refreshToken);
      const accessToken = this.jwtService.createAccessToken(
        payload.sub,
        payload.role,
      );
      return { accessToken };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout' })
  @ApiResponse({ status: 200 })
  async logOut(
    @Res({ passthrough: true }) response: express.Response,
  ): Promise<void> {
    response.clearCookie('refreshToken', {
      path: '/',
    });
  }
}
