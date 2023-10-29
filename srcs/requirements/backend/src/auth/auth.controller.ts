import { Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signin')
  signin(): string {
    return this.authService.signin();
  }

  @Post('/signup')
  signup(): string {
    return this.authService.signup();
  }
}