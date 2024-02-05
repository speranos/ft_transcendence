import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma-md.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaMdModule {}
