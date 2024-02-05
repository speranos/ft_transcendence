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

  async sendFriendRequest(senderId: number, receiverId: number) {
    var usersender = this.prisma.user.findUnique({
        where: {
            id: senderId,
        }
    });
    console.log(usersender);
    const reid = await this.prisma.friendshipRequest.create({
        data: {
          senderId: senderId,
          receiverId: receiverId,
          status: 'PENDING',
        },
      });
    return reid.id;
  }
  
  
  async acceptFriendRequest(requestId: number) {
    const request = await this.prisma.friendshipRequest.findUnique({ where: { id: requestId } });

    if (!request || request.status !== 'PENDING') {
      throw new NotFoundException('Friendship request not found or not pending');
    }

    await this.prisma.friendshipRequest.update({
      where: { id: requestId },
      data: { status: 'ACCEPTED' },
    });

    const   sender = await this.prisma.user.update({
        where: { id: request.senderId},
        data: { friends: {connect: {id: request.receiverId}}}
    });

    const   receiver = await this.prisma.user.update({
        where: { id: request.receiverId},
        data: { friends: {connect: {id: request.senderId}}}
    });

    return this.prisma.friendshipRequest.findUnique({ where: { id: requestId } });
  }

}
