// src/friendship/friendship.controller.ts
import { Controller, Post, Body, Param } from '@nestjs/common';
import { FriendshipService } from './friendship.service';


@Controller()
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) {}

  // @Post('send-request/:senderId/:receiverId')
  // sendFriendRequest(@Param('senderId') senderId: string, @Param('receiverId') receiverId: string) {
  //   // const senderIdNumber = parseInt(senderId, 10);
  //   // const receiverIdNumber = parseInt(receiverId, 10);
  //   return this.friendshipService.sendFriendRequest(senderId, receiverId);
  // }

  // @Post('accept-request/:requestId')
  // acceptFriendRequest(@Param('requestId') requestId: string) {
  //   return this.friendshipService.acceptFriendRequest(requestId);
  // }

  @Post('blockfriendship/:friendshipId')
  blockFriendShip(@Param('friendshipId') friendshipId: string){
    return this.friendshipService.blockFriendShip(friendshipId);
  }

  //note: more api to be added here!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

}