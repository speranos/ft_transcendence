// import { Injectable } from '@nestjs/common';
// import { PrismaClient } from '@prisma/client';

// @Injectable()
// export class PrismaService extends PrismaClient {
//     constructor(){
//         super({
//             datasources: {
//                 db: {
//                     url: 'postgresql://post:Password@localhost:5434/postcont?schema=public'
//                 },
//             },
//         });
//     }
// }



import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}