import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import apiSuccess from 'src/utils/api-success';
import ApiError from 'src/utils/api-errror';
import { LoginDto } from 'src/dtos/login.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CookieOptions, Response } from 'express';

@Injectable()
export class AuthService {
  // Inject services to AuthService
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
  ) {}

  //* REGISTER USER
  async register(data: CreateUserDto) {
    //check if email already exists before creating user
    const emailExists = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (emailExists) {
      throw new ConflictException(
        'Hmm... Looks like we already have that email',
      );
    }

    // Hash the password
    const hashed_pass = await bcrypt.hash(data.password, 14);

    const user = await this.prisma.user.create({
      data: {
        ...data,
        username: data.username,
        email: data.email,
        password: hashed_pass,
      },
    });

    return apiSuccess(201, user, 'User created successfully!');
  }

  //* LOGIN USER
  async login(data: LoginDto) {
    // check if user exists
    const existing_user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (!existing_user) {
      throw new UnauthorizedException('Hmm... invalid credentials');
    }

    // Compare password
    const isPasswordCorrect = await bcrypt.compare(
      data.password,
      existing_user.password,
    );
    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Hmm... invalid credentials');
    }

    //CREATE AUTH TOKENS
    const { access_token, refreshToken, refreshTokenOptions } =
      await this.createAuthTokens(existing_user.id, existing_user.email);

    return {
      access_token,
      refreshToken,
      refreshTokenOptions,
    };
  }
  // ___ END LOGIN __ //

  // * LOGOUT USER -- Handled by the controller, because we are only removing the cookie

  //* REFRESH TOKENS -- Also handled by the controller because we need to access @Res decorator
  async refreshTokens() {
    //check if refresh token exists
  }

  //! create auth tokens
  async createAuthTokens(userId: string, email: string) {
    try {
      const payload = { userId, email };

      const refresh_token_secret = this.config.get<string>(
        'REFRESH_TOKEN_SECRET',
      ) as string;

      const access_token = await this.jwt.signAsync(payload); //secret and expiresIn are handled in the import in the module

      //* REFRESH TOKEN
      const refreshToken = await this.jwt.signAsync(payload, {
        secret: refresh_token_secret,
        expiresIn: '7d',
      });

      // hash and save refresh token to database
      const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          refresh_token: hashedRefreshToken,
        },
      });

      //* Cookie Options
      const refreshTokenExpires = 7; //  7 days
      const refreshTokenOptions: CookieOptions = {
        maxAge: refreshTokenExpires * 24 * 60 * 60 * 1000,
        expires: new Date(
          Date.now() + refreshTokenExpires * 24 * 60 * 60 * 1000,
        ),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      };

      return {
        access_token,
        refreshToken,
        refreshTokenOptions,
      };
      //   return apiSuccess(200, {access_token, refreshToken, refreshTokenOptions}, "Login Success!!");
      //
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
