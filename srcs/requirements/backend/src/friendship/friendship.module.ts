// src/friendship/friendship.module.ts
import { Module } from '@nestjs/common';
import { FriendshipController } from './friendship.controller';
import { FriendshipService } from './friendship.service';
import { PrismaMdModule } from '../prisma-md/prisma-md.module';
import { friendShipGateway } from './friendship.gateway';

@Module({
  imports: [PrismaMdModule],
  controllers: [FriendshipController],
  providers: [FriendshipService, friendShipGateway],
})
export class FriendshipModule {}
