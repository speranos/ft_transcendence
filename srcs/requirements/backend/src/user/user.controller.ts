import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { auth42dto } from 'src/auth/dto';

@Controller('user')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('')
  async userData(@Req() req): Promise<auth42dto> {
    console.log(" 000000000 >>>>>>> ",req.user);
    let test : auth42dto = await this.userService.findOnebyID(req.user);
    console.log(" -------> ", test);
    return test;
  }
}
