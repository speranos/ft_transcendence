import { Param } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { arrayMinSize } from 'class-validator';
import { request } from 'http';
import { identity } from 'rxjs';
import { Socket, Server } from 'socket.io';
import { serialize } from 'v8';
import { PrismaService } from '../prisma-md/prisma-md.service';
import { ChatService } from './chat.service';


@WebSocketGateway()
export class ChatGateway {
	@WebSocketServer()
	server: Server;

	constructor (private prisma: PrismaService) {}

	@SubscribeMessage('send message')
	async SendMessage(@MessageBody() message: string, client: Socket, arg: any){
		const [sender, recv, roomID] = ['user1', 'user2', '086c7556-9c53-4fbf-8d82-d6f6fcbfa047'];
		arg = [sender, recv, roomID];

		//i need to check if user banned or muted or if is member aslan
		const mssg = await this.prisma.message.create({
			data: {
				content: message,
				senderId: arg[0],
				roomId: roomID,
			}
		});
	return mssg;		
	}

	@SubscribeMessage('create Pub room')
	async PubRoomCreation(client: Socket, arg: any) {
		const [user, RoomName] = ['user1', 'petit clos'];
		arg = [user, RoomName];
		// i need to check if the room is private or pub
		const room = await this.prisma.room.create({
			data: {
				userId: arg[0],
				name: arg[1],
				type: 'PUBLIC',
				members: {
					connect: {
						userID: arg[0],
					}
				},
				RoomMembership: {
					create: {
						role: 'OWNER',
						user: { connect: { userID: 'user2' } }
					}
				},
			},
		});
		console.log(room);
	}

	@SubscribeMessage('delete room')
	async deletroom(client: Socket, arg: any){
		const [userid, roomid] = ['user1', 'a0629773-3139-4e45-b740-f05d691d4815']
		arg = [userid, roomid];

		const membership = await this.prisma.roomMembership.findUnique({
			where: {
				memberuserId: arg[0],
				roomId: arg[1]
			}
		});
		if(membership.role != 'OWNER')
			return 'dont own the privallage for this action';
		await this.prisma.roomMembership.deleteMany({where: {roomId: arg[1]}});
		await this.prisma.room.delete({where: {id: arg[1]}});

	}

	@SubscribeMessage('join room')
	async JoinRoom(client: Socket, arg: any){
		const [userid, roomtype, roomid] = ['user2', 'Public', '3d8de3e5-a088-4e87-950c-9b5bc46aeb6c'];
		arg = [userid, roomtype, roomid];
		//i need to check if the user is banned
		// And if the room type is password protected
		await this.prisma.room.update({
			where: {id: arg[2]},
			data: {
				members: {
					connect: {
						userID: arg[0]
					}
				},
				RoomMembership: {
					create: {
						memberuserId: arg[0],
						role: 'MEMBER',
					}
				}
			}
		});
	}

	@SubscribeMessage('kick')
	async Kick(client: Socket, arg: any){
		const [userid, removedid, roomid] = ['user1', 'user2', '3d8de3e5-a088-4e87-950c-9b5bc46aeb6c'];
		arg = [userid, removedid, roomid];

		const admin = await this.prisma.roomMembership.findUnique({
			where: {
				roomId: arg[2],
				memberuserId: arg[0]
			}
		});
		if(admin.role != 'ADMIN' && admin.role != 'OWNER')
			return	'dont own the privallage for this action';
		const removeduser = await this.prisma.roomMembership.findUnique({
			where: {
				roomId: arg[2],
				memberuserId: arg[1]
			}
		});
		if(removeduser.role == 'OWNER')
			return	'dont own the privallage for this action';
		
		await this.prisma.room.update({
			where: {
				id: removeduser.roomId,
			},
			data: {
				members: {
					disconnect: {
						userID: removeduser.memberuserId,
					}
				}
			}
		});
		await this.prisma.roomMembership.delete({where: removeduser});
		// note ha bach tla3 kick 'https://www.youtube.com/watch?v=ORKJysDYbSE'
	}

	@SubscribeMessage('add room pass')
	async AddRoomPass(){

	}

	@SubscribeMessage('remove room pass')
	async RmRoomPass(){

	}

	@SubscribeMessage('set admin')
	async SetAdmin(){

	}

	@SubscribeMessage('Ban')
	async Ban(){

	}

	@SubscribeMessage('Mute')
	async Mute(){

	}
	

	

	
}
