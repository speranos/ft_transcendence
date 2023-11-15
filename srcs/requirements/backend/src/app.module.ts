import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaMdModule } from './prisma-md/prisma-md.module';

@Module({
  imports: [AuthModule, UserModule, PrismaMdModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
