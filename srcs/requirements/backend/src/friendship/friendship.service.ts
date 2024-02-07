// src/friendship/friendship.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { doesNotMatch } from 'assert';
import { randomBytes } from 'crypto';
import { userInfo } from 'os';
import { send } from 'process';

import { PrismaService } from '../prisma-md/prisma-md.service';



@Injectable()
export class FriendshipService {
  constructor(private prisma: PrismaService) {}

  async sendFriendRequest(senderId: string, receiverId: string) {
    // await this.prisma.user.create({
    //   data: {
    //     userID: 'user1',
    //     userName: 'amine',
    //     email: 'amine@amine.com',
    //     oauth: 'user1',
    //   },
    // });
    // await this.prisma.user.create({
    //   data: {
    //     userID: 'user2',
    //     userName: 'oussama',
    //     email: 'oussam@oussama.com',
    //     oauth: 'user2',
    //   },
    // });


    const reid = await this.prisma.friendshipRequest.create({
        data: {
          senderID: senderId,
          receiverID: receiverId,
          status: 'PENDING',
          type: 'FRIENDSHIP',
        },
      });
    return reid.requestID;
  }
  
  
  async acceptFriendRequest(requestId: string) {
    const request = await this.prisma.friendshipRequest.findUnique({ where: { requestID: requestId } });

    if (!request || request.status !== 'PENDING') {
      throw new NotFoundException('Friendship request not found or not pending');
    }

    await this.prisma.friendshipRequest.update({
      where: { requestID: requestId },
      data: { status: 'ACCEPTED' },
    });

    const friends = await this.prisma.friendship.create({
      data: {
        user1ID: request.senderID,
        user2ID: request.receiverID,
        friendshipStatus: 'FRIENDS'
      },
    });
    return this.prisma.friendshipRequest.findUnique({ where: { requestID: requestId } });
  }

}
