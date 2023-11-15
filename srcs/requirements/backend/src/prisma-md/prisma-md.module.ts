import { Global, Module } from '@nestjs/common';
import { PrismaMdService } from './prisma-md.service';

@Global()
@Module({
  providers: [PrismaMdService],
  exports: [PrismaMdService],
})
export class PrismaMdModule {}
