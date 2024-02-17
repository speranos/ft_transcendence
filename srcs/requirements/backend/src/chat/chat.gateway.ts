import { Param } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { request } from 'http';
import { Socket, Server } from 'socket.io';
import { serialize } from 'v8';
import { PrismaService } from '../prisma-md/prisma-md.service';
import { ChatService } from './chat.service';


@WebSocketGateway()
export class ChatGateway {
	@WebSocketServer()
	server: Server;
	prisma: PrismaService;

	@SubscribeMessage('creat DM')
	DMcreation(){


	}

	@SubscribeMessage('send DM')
	SendDM(){

	}

	@SubscribeMessage('create room')
	RoomCreation(@MessageBody() data: any, client: Socket, payload: any): string { 

		// console.log(senderid);
		// const {room, message} = data;
		console.log(client);
		// this.server.sockets.adapter.addr
		const roomName: string = 'chanel1';
		client.join(roomName)
		this.server.to(roomName).emit('arawkan', data);
		// const rooms = this.server.sockets.adapter.rooms;
		// console.log('Active Rooms:', rooms);
		// this.server.sockets.adapter.addRoom(roomName);

		return 'Hello world!';
	}

	@SubscribeMessage('delete room')
	deletroom(){

	}

	@SubscribeMessage('add member')
	AddMember(){

	}

	@SubscribeMessage('remove member')
	RemoveMember(){

	}

	

	

	
}
