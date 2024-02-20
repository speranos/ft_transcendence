import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RoomType } from '@prisma/client';
import { RoomRole } from '@prisma/client';
import { PrismaService } from '../prisma-md/prisma-md.service';

@Injectable()
export class ChatUtils {
    constructor(private readonly prisma: PrismaService) {}
    async Hash(pass: string){
        const salt = '$2a$10$abcdefghijklmnopqrstuvwxyz01234';
        const hash = await bcrypt.hash(pass, salt);
        return hash;
    }

    T_Room(input: string){
        if(input === 'PUBLIC')
            return RoomType.PUBLIC;
        else if(input === 'PRIVATE')
            return RoomType.PRIVATE;
        else if(input === 'PASSWORD_PROTECTED')
            return RoomType.PASSWORD_PROTECTED;
    }

    async T_membership(userid: string, roomid: string){
        const member = await this.prisma.roomMembership.findUnique({
            where: {
                memberuserId: userid,
                roomId: roomid,
            }
        });
    // console.log(member);
    return member;
    }
}