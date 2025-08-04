import { Global, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Global() //Make users Module globally available
@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
