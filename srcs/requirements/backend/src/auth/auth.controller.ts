import { Body, Controller, Get, Post} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Authdto } from '../dto';


@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signin')
  signin() {
    return this.authService.signin();
  }

  @Post('/signup')
  signup(@Body() dto: Authdto) {
    console.log(dto);
    return this.authService.signup(dto);
  }
}