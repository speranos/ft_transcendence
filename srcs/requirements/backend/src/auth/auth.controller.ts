import { Controller, Post, Get, UseGuards, Req, Res, HttpCode, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { FourTwoAuthGuard } from './AuthGuards/42AuthGuard';
import { Public } from './decorators/public.decorator'
import { FourTwoStrategy } from './42Strategy/42Strategy';
import { ConfigService } from '@nestjs/config';
import { auth42dto } from './dto';
import { Token } from './Token.types';
import { PrismaService } from '../prisma-md/prisma-md.service';
import { config } from 'process';

@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService, prisma: PrismaService, config: ConfigService){}
    @Public()
    @Get()
    @UseGuards(AuthGuard('42'))
    async forty(){}

    @Public()
    @UseGuards(AuthGuard('42'))
    @Get('accept')
    async logUser(@Req() req, @Res() res){
        let token : Token = null;
        const newData = new auth42dto();
        newData.email = req.user['email'];
        newData.link = req.user['link'];
        newData.userName = req.user['userName'];
        let checker : boolean = await this.authService.userChecker(newData.email, newData.userName);
        if (!checker){
            token = await this.authService.createNewUser(newData);
        }
        else{
            token = await this.authService.userLogIn(newData);
        }
        res.cookie('AToken', token.AToken, {httpOnly: true});
        res.cookie('RToken', token.RToken, {httpOnly: true});
        res.cookie('userLogged', true);
        res.send({message : "User logged In"});
        res.complete;
        return res; 
    }

    @Get('disconnect')
    @UseGuards(AuthGuard('jwt'))
    logUserOut(@Req() req, @Res() res){
        let user = req.user;
        this.authService.userLogOut(user.id);
        res.clearCookie('AToken');
        res.clearCookie('RToken');
        res.cookie('userLogged', false);
        res.send({message : "User Logged Out"});
        res.complete;
    }

    @Get('refresh')
    @UseGuards(AuthGuard('jwtRefresh'))
    @HttpCode(HttpStatus.OK)
    async refreshSession(@Req() req, @Res() res){
        let token : Token = null;
        let dataDTO: auth42dto;
        console.log("AToken :", req.cookies['AToken'], "\n", "RToken", req.cookies['RToken']);
        //console.log("---------->",req.user, req.cookies);
        res.clearCookie('AToken');
        res.clearCookie('RToken');
        token = await this.authService.refreshSessionTokens(req.user.userID, req.cookies.RToken);
        res.cookie("AToken", token.AToken, {httpOnly: true, secure: true,});
        res.cookie("RToken", token.RToken,{httpOnly: true, secure: true,});
        res.send({message :"Tokens Refreshed"});
        console.log("After AToken :", req.cookies['AToken'], "\n", "After RToken", req.cookies['RToken']);
        res.complete;
    }

}
