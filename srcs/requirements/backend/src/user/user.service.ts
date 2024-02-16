import { ForbiddenException, Injectable } from '@nestjs/common';
import { auth42dto } from 'src/auth/dto';
import { PrismaService } from '../prisma-md/prisma-md.service';

@Injectable()
export class UserService {

  constructor(private prisma : PrismaService){}


  async findOnebyID(userX : any):Promise<auth42dto> {
    try{
      const user = this.prisma.user.findUnique({
        where:{
          userID : userX.userID,
        } 
      });
      if (!user) throw new ForbiddenException("User not found");
      else{
          const dataResp : auth42dto =  {
          ID : (await user).userID,
          userName : (await user).userName,
          link : (await user).avatar,
          email : ''
        };
        console.log("return v ::: ", dataResp);
        return dataResp;
      }
    }
    catch(e){}
  }
}
