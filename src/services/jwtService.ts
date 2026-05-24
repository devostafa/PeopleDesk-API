import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { UserRole } from '../data/enums/userRole';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtService {
  constructor(
    private readonly nestJwtService: NestJwtService,
    private readonly configService: ConfigService,
  ) {}

  createAccessToken(userId: string, role: UserRole): string {
    const payload = { sub: userId, role };
    return this.nestJwtService.sign(payload, {
      secret: this.configService.get<string>(
        'JWT_ACCESS_SECRET',
        'access_secret',
      ),
      expiresIn: '15m',
    });
  }

  createRefreshToken(userId: string, role: UserRole): string {
    const payload = { sub: userId, role };
    return this.nestJwtService.sign(payload, {
      secret: this.configService.get<string>(
        'JWT_REFRESH_SECRET',
        'refresh_secret',
      ),
      expiresIn: '7d',
    });
  }

  verifyAccessToken(token: string): { sub: string; role: UserRole } {
    return this.nestJwtService.verify(token, {
      secret: this.configService.get<string>(
        'JWT_ACCESS_SECRET',
        'access_secret',
      ),
    });
  }

  verifyRefreshToken(token: string): { sub: string; role: UserRole } {
    return this.nestJwtService.verify(token, {
      secret: this.configService.get<string>(
        'JWT_REFRESH_SECRET',
        'refresh_secret',
      ),
    });
  }
}
