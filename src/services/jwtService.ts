import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { UserRole } from '../data/enums/userRole';

@Injectable()
export class JwtService {
  constructor(private readonly nestJwtService: NestJwtService) {}

  createToken(userId: number, role: UserRole): string {
    const payload = { sub: userId, role };
    return this.nestJwtService.sign(payload);
  }

  verifyToken(token: string): { sub: number; role: UserRole } {
    return this.nestJwtService.verify(token);
  }
}
