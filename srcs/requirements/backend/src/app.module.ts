import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaMdModule } from './prisma-md/prisma-md.module';
// import { GoogleStrategy } from './strategies/google.strategy';
import { ChatGateway } from './chat/chat.gateway';
import { FriendshipModule } from './friendship/friendship.module';
import { FriendshipService } from './friendship/friendship.service';
import { ChatService } from './chat/chat.service';

@Module({
  imports: [UserModule, PrismaMdModule, FriendshipModule],
  controllers: [AppController],
  providers: [AppService, ChatGateway, ChatService],
})
export class AppModule {}
