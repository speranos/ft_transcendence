import { Injectable, Req, UnauthorizedException, Res, ForbiddenException, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma-md/prisma-md.service';
import { auth42dto } from './dto';
import { Token } from "./Token.types"
import { ConfigService } from '@nestjs/config';
import * as crypt from 'bcrypt'

@Injectable()
export class AuthService {
    constructor( private prisma: PrismaService, private jwt: JwtService, private config: ConfigService){}
    signUp(){}
    signIn(){}
    async createNewUser(newData: auth42dto): Promise<Token>{
        const newUser = this.prisma.user.create({
            data: {
                userName : newData.userName,
                email    : newData.email,
                avatar   : newData.link,
            },
        });
        newData.ID = (await newUser).userID;
        const allToken = this.TokenGenerator(newData);
        const HToken = await this.HTokenGenerator(allToken.RToken);
        await this.prisma.user.update({
            where :{
                userID : newData.ID,
                email : newData.email,
            },
            data:{
                RTokens : HToken,
                userOnline : true,
            }
        })
        return allToken;
    } 
    async userLogIn(newData: auth42dto): Promise<Token>{
        const logInUser = this.prisma.user.findUnique({
            where : {
                email : newData.email,
            },
        });
        if (!logInUser)
            throw new UnauthorizedException("Apologies! Seems like we have lost track of who you are, Please SignUp again");
        newData.ID = (await logInUser).userID;
        const allToken =  this.TokenGenerator(newData);
        const HToken = await this.HTokenGenerator(allToken.RToken);
        await this.prisma.user.update({
            where :{
                userID : newData.ID,
                email : newData.email,
            },
            data:{
                RTokens : HToken,
                userOnline : true,
            }
        })
        return allToken;
    }
    async userChecker(dataDTOEmail: string, dataDTOUserName: string):Promise<boolean>{
        const user = await this.prisma.user.findUnique({
            where: {
                email : dataDTOEmail,
                userName : dataDTOUserName,
            },
        });
        if (!user)
            return false;
        return true;
    }
    TokenGenerator(user : auth42dto ):Token{
        let AToken = this.jwt.sign({
            id : user.ID,
            email : user.email,
            username : user.userName,
        }, {
            secret : this.config.get('JWTATSECRET'),
            expiresIn : 60 * 60,
        });
        let RToken = this.jwt.sign({
            id : user.ID,
            email : user.email,
            username : user.userName,
        },{
            secret : this.config.get('JWTRTSECRET'),
            expiresIn : 60 * 15 * 4 * 24 * 30 * 7,
        });
        return {
            AToken: AToken,
            RToken : RToken,
        };
    }
    async HTokenGenerator(RToken: string):Promise<string>{
        const Hashed = crypt.hash(RToken, 10);
        return Hashed;
    }

    async userLogOut(id: string){
        this.prisma.user.update({
            where : {
                userID : id,
            },
            data:{
                userOnline : false,
                RTokens : null,
            },
        })
        return;
    }

    async refreshSessionTokens(userID: string, RToken : string): Promise<Token>{
        try{
            const User = this.prisma.user.findUnique({
                where : {
                    userID : userID,
                }
            });
            if(!User)
                throw new ForbiddenException('User not found');
            else{
                let comparedHash = await crypt.compare(RToken, (await User).RTokens);
                if (!comparedHash) throw new ForbiddenException('Token Problem, Please relog!');
                let userData : auth42dto = {
                    ID : (await User).userID,
                    email : (await User).email,
                    userName : (await User).userName,
                    link : '',
                };
                const Tokens = this.TokenGenerator(userData);
                const newHashedToken = await this.HTokenGenerator(Tokens.RToken);
                (await User).RTokens = newHashedToken;
                return Tokens;
            }
        }
        catch(e){
            throw new HttpException("User needs to relog", HttpStatus.FORBIDDEN);
        }
    }
}
