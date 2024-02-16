import { ConfigService } from "@nestjs/config"
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { Request } from "express"
import { ForbiddenException, Injectable} from "@nestjs/common"
import { PrismaService } from "../../prisma-md/prisma-md.service"
import { Prisma } from "@prisma/client"

@Injectable()
export class ATokenStrategy  extends PassportStrategy(Strategy, 'jwt'){
    constructor(private readonly config: ConfigService, private readonly prisma: PrismaService){
        super({
            jwtFromRequest : ExtractJwt.fromExtractors([
            ATokenStrategy.JWTextractor]),
            ignoreExpiration : false,
            secretOrKey : config.get('JWTATSECRET'),
            passReqToCallback : true,
        })
    }
    private static JWTextractor(req: Request): string | null{
        if (req?.cookies && 'AToken' in req?.cookies)
            return req.cookies.AToken;
        return null;
    }
    async validate(req: Request, payload: any){
        console.log("USERID ----->", payload.id);
            const user = await this.prisma.user.findUnique({
                where:{
                    userID : payload.id,
                    userName : payload.userName,
                }
            });
            if(!user)
                throw new ForbiddenException("User not found");
            return user;
        }
    }