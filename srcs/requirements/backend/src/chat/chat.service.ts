import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma-md/prisma-md.service';


@Injectable()
export class ChatService {
    constructor(private prisma: PrismaService){}

    async handel_connex(){
        console.log('TWETETWET');
    }
}
