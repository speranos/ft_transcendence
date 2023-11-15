import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaMdService extends PrismaClient {
    constructor(){
        super({
            datasources: {
                db: {
                    url: 'postgresql://post:Password@localhost:5434/postcont?schema=public'
                },
            },
        });
    }
}
