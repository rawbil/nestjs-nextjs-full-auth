import {IsEmail, IsNotEmpty, IsString, IsStrongPassword} from 'class-validator'

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @IsStrongPassword()
    password: string;
}