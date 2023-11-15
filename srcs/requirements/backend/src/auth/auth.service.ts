import { Injectable } from '@nestjs/common';
import { Authdto } from 'src/dto';
import { PrismaMdService } from 'src/prisma-md/prisma-md.service';
// import { validate } from 'class-validator';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(private data: PrismaMdService){}
  signin(): string {
    return 'signin';
  }
  async signup(dto: Authdto) {
    const hash = await argon.hash(dto.password);
    console.log(hash);
    return 'signup';
  }
}
