// src/friendship/friendship.controller.ts
import { Controller, Post, Body, Param } from '@nestjs/common';
import { FriendshipService } from './friendship.service';


@Controller()
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) {}

  @Post('send-request/:senderId/:receiverId')
  sendFriendRequest(
    @Param('senderId') senderId: string,
    @Param('receiverId') receiverId: string,
  ) {
    const senderIdNumber = parseInt(senderId, 10);
    const receiverIdNumber = parseInt(receiverId, 10);
    return this.friendshipService.sendFriendRequest(senderIdNumber, receiverIdNumber);
  }

  @Post('accept-request/:requestId')
  acceptFriendRequest(@Param('requestId') requestId: string) {
    const request = parseInt(requestId, 10);
    return this.friendshipService.acceptFriendRequest(request);
  }

  // Add more API endpoints as needed
}