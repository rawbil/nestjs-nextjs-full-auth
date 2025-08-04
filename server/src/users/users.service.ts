import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import apiSuccess from 'src/utils/api-success';
import ApiError from 'src/utils/api-errror';
import { UpdateUserDto } from 'src/dtos/update-user.dto';
import { UserRole } from 'generated/prisma';

@Injectable()
export class UsersService {
  //~ Inject prisma service to the class
  constructor(private readonly prisma: PrismaService) {}

  //* CREATE NEW USER
  async createUser(data: CreateUserDto) {
    try {
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
    } catch (error) {
      return ApiError(500, error.message);
    }
  }

  //* GET USER
  async getUser(id: string) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      // Throw an error if user is not found
      if (!user)
        throw new NotFoundException('Hmm... Are you sure that user exists?');

      return apiSuccess(200, user, undefined);
    } catch (error) {
      return ApiError(500, error.message);
    }
  }

  //* GET ALL USERS
  async getUsers() {
    try {
      const user = await this.prisma.user.findMany();
      return apiSuccess(200, user, undefined);
    } catch (error) {
      return ApiError(500, error.message);
    }
  }

  //* UPDATE USER
  async updateUser(id: string, data: UpdateUserDto) {
    try {
      // find user with id
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user)
        throw new NotFoundException('Hmm... Are you sure that user exists?');

      // Check if email is provided and validate it
      if (data.email) {
        const emailExists = await this.prisma.user.findUnique({
          where: { email: data.email },
        });
        if (emailExists) {
          throw new ConflictException(
            'Hmm... Looks like we already have that email',
          );
        }
      }

      //throw error if role is not among the ones in the enum
      if (data.role && !Object.values(UserRole).includes(data.role)) {
        throw new BadRequestException('Provided role is not undefined');
      }

      const updatedUser = await this.prisma.user.update({
        where: { id },
        data,
      });

      return apiSuccess(201, updatedUser, 'User updated successfully!');
    } catch (error) {
      return ApiError(500, error.message);
    }
  }

  //* DELETE USER
  async deleteUser(id: string) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) {
        throw new NotFoundException('Hmm...User not found');
      }

      await this.prisma.user.delete({ where: { id } });

      return apiSuccess(200, undefined, 'User deleted successfully!');
    } catch (error) {
      return ApiError(500, error.message);
    }
  }
}
