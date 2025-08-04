import {
  Body,
  Controller,
  HttpCode,
  InternalServerErrorException,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { LoginDto } from 'src/dtos/login.dto';
import { Request, Response } from 'express';
import apiSuccess from 'src/utils/api-success';
import { JwtGuard } from 'src/utils/guards/jwt.auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetUser } from 'src/utils/decorators/get-user.decorator';
import * as bcrypt from 'bcrypt';

@Controller('auth')
export class AuthController {
  //Inject auth service
  constructor(
    private readonly auth: AuthService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  //* /POST /api/auth/register

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.auth.register(createUserDto);
  }

  //* POST /api/auth/login
  @Post('login')
  @HttpCode(200)
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() loginDto: LoginDto,
  ) {
    const { access_token, refreshToken, refreshTokenOptions } =
      await this.auth.login(loginDto);

    res.cookie('refresh_token', refreshToken, refreshTokenOptions);

    // return final response with access_token
    return { statusCode: 200, access_token, message: 'Login Success!!' };
  }

  //* POST /api/auth/logout
  @UseGuards(JwtGuard)
  @Post('logout')
  async logout(
    @Res({ passthrough: true }) res: Response,
    @GetUser('id') id: string,
  ) {
    //remove refresh token from database
     await this.prisma.user.update({
      where: { id },
      data: {
        refresh_token: null,
      },
    });
    res.clearCookie('refresh_token');
    return apiSuccess(200, undefined, 'Logged out');
  }

  //* POST /api/auth/refresh
  @UseGuards(JwtGuard)
  @Post('refresh')
  async refreshTokens(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @GetUser('id') userId: string,
  ) {
    try {
      const refresh_token = req.cookies.refresh_token;
      const user = await this.prisma.user.findUnique({ where: { id: userId } });

      if (!refresh_token) {
        throw new UnauthorizedException(
          'Refresh cookie not found. Please login again',
        );
      }

      // compare refresh token with saved refresh token
      const compareTokens = await bcrypt.compare(
        refresh_token,
        user?.refresh_token as string,
      );
      if (!compareTokens) {
        throw new UnauthorizedException(
          'Hmmm... Refresh token invalid. Please login again',
        );
      }

      // Verify refresh token
      const decoded = await this.jwt.verifyAsync(refresh_token, {
        secret: this.config.get('REFRESH_TOKEN_SECRET'),
      });

      if (!decoded) {
        throw new UnauthorizedException(
          "Authorization failed. Try loggin' in again",
        );
      }

      const { access_token, refreshToken, refreshTokenOptions } =
        await this.auth.createAuthTokens(decoded.userId, decoded.email);

      res.cookie('refresh_token', refreshToken, refreshTokenOptions);

      // return final response with access_token
      return { statusCode: 200, access_token };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // if you want to manually set a status code, use @HttpCode()
}
