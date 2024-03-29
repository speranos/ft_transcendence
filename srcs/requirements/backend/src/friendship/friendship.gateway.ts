import { Injectable, NotFoundException } from '@nestjs/common';
import { doesNotMatch } from 'assert';
import { randomBytes } from 'crypto';
import { userInfo } from 'os';
import { send } from 'process';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { PrismaService } from '../prisma-md/prisma-md.service';
import { Server } from 'http';
import { Socket } from 'dgram';
import { subscribe } from 'diagnostics_channel';


@WebSocketGateway()
export class friendShipGateway{
  @WebSocketServer()
  server: Server;
  // prisma: PrismaService;
  constructor(private prisma: PrismaService) {}


  @SubscribeMessage('send request')
  async sendFriendRequest(client: Socket, arg: any)
  {
    const [sendid, recvid] = ['user1', 'user2'];
    arg = [sendid, recvid];

    const req = await this.prisma.friendshipRequest.create({
      data: {
        senderID: arg[0],
        receiverID: arg[1],
        status: 'PENDING',
        type: 'FRIENDSHIP',
      },
    });
  //crer chi event 3andek ou emit mn lhna that the request is sucess if it's needed if not rah kha return is enough
  return req.requestID;
  }

  @SubscribeMessage('accept request')
  async acceptFriendRequest(client: Socket, arg: any)
  {
    const requestid = '6c792406-4d6c-4b19-be89-6685b31730cd';
    const jwt = 'no idea yet';
    arg = [requestid, jwt];
    const req = await this.prisma.friendshipRequest.findUnique({where: {requestID: arg[0]}});

    if(!req || req.status != 'PENDING')
      throw new NotFoundException('Friendship request not found or not pending');
    
    await this.prisma.friendshipRequest.update({
      where: {requestID: arg[0]},
      data: {status: 'ACCEPTED'},
    });

    const ret = await this.prisma.friendship.create({
      data:{
        user1ID: req.senderID,
        user2ID: req.receiverID,
        friendshipStatus: 'FRIENDS',
      }
    });
  const sender = await this.prisma.user.findUnique({where: {userID: req.senderID}});
  const dm = await this.prisma.room.create({
    data:{
      userId: req.receiverID,
      name: '',
      type: 'DM',
      members:{
        connect: [
        {userID: req.senderID},
        {userID: req.receiverID},
        ]
      },
    },
    // include : {}
  });
  console.log(dm);
  //crer chi event 3andek ou emit mn lhna that the request is sucess if it's needed if not rah kha return is enough
  return;
}


@SubscribeMessage('create user')
async getuser(){
  // const req = await this.prisma.room.findUnique({where: {
  //   id: '086c7556-9c53-4fbf-8d82-d6f6fcbfa047'},
  //   include: { members: true},
  // });
  // // console.log(req.)
  // const members = req.members;
  // console.log(members);
  await this.prisma.user.create({
    data: {
      userID: 'user4',
      userName: 'ouss',
      email: 'ouss@ouss.com'
    }
  });
  await this.prisma.user.create({
    data: {
      userID: 'user3',
      userName: 'amine',
      email: 'amine@amine.com'
    }
  });
  await this.prisma.user.create({
    data: {
      userID: 'user2',
      userName: 'samine',
      email: 'samine@samine.com'
    }
  });
  await this.prisma.user.create({
    data: {
      userID: 'user1',
      userName: 'mehdi',
      email: 'mehdi@mehdi.com'
    }
  });



}

  @SubscribeMessage('decline request')
  async declineFriendRequest(clinet: Socket, arg: any)
  {
    //hna i dont know the exact behavor normalment makynch lach nbadlo status dyl request ldeclined
    //i guess khadi khir nmsa7 the alredy existed request mn database ou treseta ldefault bach y9der y3awd ysift lih another request
    // 3lach 7it bnadem makyfhemch karo lach kha tsift lchi wahd ma kat3arfouch 3ndna facebook hna tfuuu 3la 7ala
    //ma3lina ha lach ka ntmzak db btw 'https://www.youtube.com/watch?v=2ZRqtbBjelc' zahia

    const requestid = '551a019b-42f1-4d4f-9be1-b5f9347e926e'
    const jwt = 'no idea yet';
    arg = [requestid, jwt];
    console.log(arg[0]);
    // const req = await this.prisma.friendshipRequest.findUnique({ where: {requestID: arg[0]}});
    await this.prisma.friendshipRequest.delete({where: {requestID: arg[0]}});

    return 'HAAAA9 MCHAAAA!';
    //wili wili dakchi khdam mzian
    //lsa9 m3ak hadchi kheda lah yjazik
    //ou zidk had dwisk bonuse 'https://www.youtube.com/watch?v=HFYfHM973tU'
  }
}
