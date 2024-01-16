import { ForbiddenException, Injectable } from '@nestjs/common';
import { singupdto, singindto } from '../dto';
import { PrismaMdService } from 'src/prisma-md/prisma-md.service';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private db: PrismaMdService,
    private jwt: JwtService
    ){}

  async signin(dto: singindto) {
    console.log(dto);
    const hash = await argon.hash(dto.password)
    const user = await this.db.user.findUnique({
      where:{
        username: dto.username,
      },
    });
    if(!user)
      throw new ForbiddenException('User Not found!');
    const pass_check = await argon.verify(user.Password, dto.password)
    if(!pass_check)
      throw new ForbiddenException('Incorrect password!');
    const payload = {sub: user.id, username: user.username};
    const token = await this.jwt.signAsync(payload);
    // return({
      // const token: await this.jwt.signAsync(payload),
    // })
    return token;
    // return user;
  }

//   async signup(dto: singupdto) {
//     try{
//     const hash = await argon.hash(dto.password);
//     const user = await this.db.user.create({
//       data: {
//         username: dto.username,
//         email : dto.email,
//         Password: hash,
//       },
//     });
//     console.log(hash);
//     return user;
//   }
//   catch(error){
//     if(error instanceof PrismaClientKnownRequestError)
//       if(error.code === 'P2002'){
//         throw new ForbiddenException('User already exists!');
//       }
//   }
//   }
}
