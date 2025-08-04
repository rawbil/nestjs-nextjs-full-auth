import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { UpdateUserDto } from 'src/dtos/update-user.dto';
import { JwtGuard } from 'src/utils/guards/jwt.auth.guard';

@Controller('users')
export class UsersController {
  // Inject user service
  constructor(private readonly usersService: UsersService) {}

  //* POST /api/users/create
  @UseGuards(JwtGuard)
  @Post('create')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  //* GET /api/users/all
  @Get('all')
  getUsers() {
    return this.usersService.getUsers();
  }

  //* PATCH /api/users/:id/update
  @UseGuards(JwtGuard)
  @Patch(':id/update')
  updateUser(@Param('id') id: string, @Body() data: UpdateUserDto) {
    return this.usersService.updateUser(id, data);
  }

  @UseGuards(JwtGuard)
  //* DELETE /api/users/:id/delete
  @Delete(':id/delete')
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }







  

  /*___________________________________________________*/
  //! MAKE THIS THE LAST ONE TO AVOID CONFLICTS
  //* GET /api/user/:id
  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.usersService.getUser(id);
  }
}
