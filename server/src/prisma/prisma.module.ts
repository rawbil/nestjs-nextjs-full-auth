import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() //!Makes the Prisma Module available globally
@Module({
  providers: [PrismaService],
  exports: [PrismaService]
})
export class PrismaModule {}
