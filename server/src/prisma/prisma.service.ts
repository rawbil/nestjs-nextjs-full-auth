import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect()
      .then(() => console.log('Database Connected'))
      .catch((err) => console.log('Error Connecting to database: ', err));
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }
}
