import { Body, Controller, Get, Post, Res, UseGuards} from '@nestjs/common';
import { GoogleOauthGuard } from '../guards/google_auth.guard';
// import { AuthService } from './auth.service';
import { singupdto, singindto } from '../dto';


@Controller()
export class AuthController {
  // constructor(private authService: AuthService) {}

  // @Post('/signin')
  // signin(@Body() dto: singindto) {
  //   return this.authService.signin(dto);
  // }

  // @Post('/signup')
  // signup(@Body() dto: singupdto) {
  //   console.log(dto);
  //   return this.authService.signup(dto);
  // }

  @Get('/google/redir')
  @UseGuards(GoogleOauthGuard)
  google_auth(@Res() data: any){
    // console.log(data);
  }

}