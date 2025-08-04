import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const access_token_secret = config.get('ACCESS_TOKEN_SECRET');
    if (!access_token_secret) {
      throw new UnauthorizedException(
        'Authorization failed. Access token missing',
      );
    }

    super({
      secretOrKey: access_token_secret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: { userId: string; email: string }) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.userId },
    });
    if (!user) {
      throw new UnauthorizedException('Authorized user validation failed');
    }
    return user; //attatches req.user to payload
  }
}
