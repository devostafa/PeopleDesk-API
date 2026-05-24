import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from './jwtService';
import { UserRepository } from '../data/repositories/userRepository';
import { HashService } from './hashService';
import { RefreshTokenRepository } from '../data/repositories/refreshTokenRepository';
import { UserRole } from '../data/enums/userRole';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly jwtService: JwtService,
    private readonly hashService: HashService,
  ) {}

  async login(
    username: string,
    password: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userRepository.findOne({
      where: { userName: username },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.hashService.compare(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = this.jwtService.createAccessToken(user.id, user.role);
    const refreshToken = this.jwtService.createRefreshToken(user.id, user.role);

    const hashedToken = await this.hashService.hash(refreshToken);
    await this.refreshTokenRepository.save({
      hashedToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      revoked: false,
    });

    return { accessToken, refreshToken };
  }

  async refresh(refreshToken: string) {
    let payload: { sub: string; role: UserRole };
    try {
      payload = this.jwtService.verifyRefreshToken(refreshToken);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const storedTokens = await this.refreshTokenRepository.findAll({
      where: { userId: payload.sub, revoked: false },
    });

    const matchedRecord = await Promise.any(
      storedTokens.map(async (record) => {
        const match = await this.hashService.compare(
          refreshToken,
          record.hashedToken,
        );
        if (!match || record.expiresAt < new Date()) throw new Error();
        return record;
      }),
    ).catch(() => null);

    if (!matchedRecord) {
      // Possible token reuse attack — revoke all tokens for this user
      await this.refreshTokenRepository.update(
        { userId: payload.sub },
        { revoked: true },
      );
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Revoke the old token (rotation)
    await this.refreshTokenRepository.update(matchedRecord.id, {
      revoked: true,
    });

    // Issue new pair
    const newAccessToken = this.jwtService.createAccessToken(
      payload.sub,
      payload.role,
    );
    const newRefreshToken = this.jwtService.createRefreshToken(
      payload.sub,
      payload.role,
    );

    const hashedNewToken = await this.hashService.hash(newRefreshToken);
    await this.refreshTokenRepository.save({
      hashedToken: hashedNewToken,
      userId: payload.sub,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      revoked: false,
    });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async revokeRefreshToken(refreshToken: string): Promise<void> {
    try {
      const payload = this.jwtService.verifyRefreshToken(refreshToken);
      const storedTokens = await this.refreshTokenRepository.findAll({
        where: { userId: payload.sub, revoked: false },
      });

      for (const record of storedTokens) {
        const match = await this.hashService.compare(
          refreshToken,
          record.hashedToken,
        );
        if (match) {
          await this.refreshTokenRepository.update(record.id, {
            revoked: true,
          });
          break;
        }
      }
    } catch {
      // token invalid, nothing to revoke
    }
  }
}
