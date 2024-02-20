import { Param } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { PrismaService } from '../prisma-md/prisma-md.service';
import * as bcrypt from 'bcrypt';

import {ChatUtils } from './utils';


@WebSocketGateway()
export class ChatGateway {
	@WebSocketServer()
	server: Server;

	constructor (private prisma: PrismaService, private ChatUtils: ChatUtils) {}


	@SubscribeMessage('send message')
	async SendMessage(@MessageBody() message: string, client: Socket, arg: any){
		arg = ['user1', 'user2', '086c7556-9c53-4fbf-8d82-d6f6fcbfa047'];

		//i need to check if user banned or muted or if is member aslan
		const mssg = await this.prisma.message.create({
			data: {
				content: message,
				senderId: arg[0],
				roomId: arg[2],
			}
		});
	return mssg;		
	}

	@SubscribeMessage('create room')
	async RoomCreation(client: Socket, arg: any) {
		arg = ['user1', 'petit clos', 'PUBLIC'];

		const room = await this.prisma.room.create({
			data: {
				userId: arg[0],
				name: arg[1],
				type: this.ChatUtils.T_Room(arg[2]),
				members: {
					connect: {
						userID: arg[0],
					}
				},
				RoomMembership: {
					create: {
						role: 'OWNER',
						user: { connect: { userID: arg[0] } }
					}
				},
			},
		});
		console.log(room);
	}



	@SubscribeMessage('delete room')
	async deletroom(client: Socket, arg: any){
		arg = ['user2', 'cc38c8b3-ec80-4db9-bd8d-551d75673d52'];

		const membership = await  this.ChatUtils.T_membership(arg[0], arg[1]);
		if(!membership || membership.role != 'OWNER')
			return 'User dont existe OR own the privallage for this action';
		
		await this.prisma.roomMembership.deleteMany({where: {roomId: arg[1]}});
		await this.prisma.room.delete({where: {id: arg[1]}});
	}

	@SubscribeMessage('join room')
	async JoinRoom(client: Socket, arg: any){
		arg = ['user2', '35ce47bc-fa5d-4e72-b0a3-22f8974ef284', 'pass123123'];

		const room = await this.prisma.room.findUnique({where: {id: arg[1]}});
		const member = await this.ChatUtils.T_membership(arg[0], arg[1]);
		if(!room || member)
			return 'User already existe OR room dosent existe';

		if(room.type === 'PASSWORD_PROTECTED'){
			const ismatch = await bcrypt.compare(arg[2], room.password);
			if(!ismatch)
				return 'incorrect Pass !';
		}
		await this.prisma.room.update({
			where: {id: arg[1]},
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
		//still need to check if he is banned !!!!!!!!!!
	}

	@SubscribeMessage('kick')
	async Kick(client: Socket, arg: any){
		arg = ['user1', 'user2', '35ce47bc-fa5d-4e72-b0a3-22f8974ef284'];

		const admin = await  this.ChatUtils.T_membership(arg[0], arg[2]);
		if(!admin || (admin.role != 'ADMIN' && admin.role != 'OWNER'))
			return	'User dont existe OR own the privallage for this action';

		const removeduser = await  this.ChatUtils.T_membership(arg[1], arg[2]);
		if(!removeduser || removeduser.role === 'OWNER')
			return	'User dont existe OR own the privallage for this action';
		
		const room = await this.prisma.room.update({
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
		return room;
		// note ha bach tla3 kick 'https://www.youtube.com/watch?v=ORKJysDYbSE'
	}

	@SubscribeMessage('add room pass')
	async AddRoomPass(client: Socket, arg: any){
		arg = ['user1', '35ce47bc-fa5d-4e72-b0a3-22f8974ef284', 'pass123123'];
		const owner = await this.ChatUtils.T_membership(arg[0], arg[1]);
		
		// console.log(owner);
		if(!owner || owner.role != 'OWNER')
			return 'User dont existe OR own the privallage for this action';
		const room = await this.prisma.room.update({
			where: {id: arg[1]},
			data: {
				type: 'PASSWORD_PROTECTED',
				password: await  this.ChatUtils.Hash(arg[2]),
			}
		});
		return room;
		//check if the room has alredy a password
		//or leave it as feature(not a bug) for the owner to change pass depend on dak lkhlid implementation
	}


	@SubscribeMessage('remove room pass')
	async RmRoomPass(client: Socket, arg: any){
		arg = ['user1', '35ce47bc-fa5d-4e72-b0a3-22f8974ef284', 'pass123123'];

		const owner = await  this.ChatUtils.T_membership(arg[0], arg[1]);
		if(!owner || owner.role != 'OWNER')
			return 'User dont existe OR own the privallage for this action';
		const room = await this.prisma.room.findUnique({where: {id: owner.roomId}});
			
		const isMatch = await bcrypt.compare(arg[2], room.password);
		if(!isMatch)
			return 'incorrect Pass !';
		else{
			await this.prisma.room.update({
				where: {id: arg[1]},
				data: {
					type: 'PUBLIC',
					password: null,
				},
			});
		}
	return room;
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
