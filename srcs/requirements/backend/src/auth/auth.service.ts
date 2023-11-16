import { ForbiddenException, Injectable } from '@nestjs/common';
import { Authdto } from 'src/dto';
import { PrismaMdService } from 'src/prisma-md/prisma-md.service';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
  constructor(private db: PrismaMdService){}
  signin(): string {
    return 'signin';
  }
  async signup(dto: Authdto) {
    try{
    const hash = await argon.hash(dto.password);
    const user = await this.db.user.create({
      data: {
        username: dto.username,
        email : dto.email,
        Password: hash,
      },
    });
    console.log(hash);
    return user;
  }
  catch(error){
    if(error instanceof PrismaClientKnownRequestError)
      if(error.code === 'P2002'){
        throw new ForbiddenException('User already exists!');
      }
  }
  }
}
