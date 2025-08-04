import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole } from 'generated/prisma';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  username?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
