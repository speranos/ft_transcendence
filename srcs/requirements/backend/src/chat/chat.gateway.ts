import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
// import { Server } from 'http';
import { Socket, Server } from 'socket.io';
import { PrismaMdService } from 'src/prisma-md/prisma-md.service'; 


@WebSocketGateway()
export class ChatGateway {
	@WebSocketServer()
	server: Server;
	prisma: PrismaMdService;

	@SubscribeMessage('create room')
	creation(@MessageBody() msg: string, client: Socket, payload: any): string {
		console.log(msg);
		// console.log();
		// this.prisma.chat
		console.log(this.prisma.chat.fields.id)
		return 'Hello world!';
	}

	@SubscribeMessage('delete room')
	deletroom(){

	}
	
}
