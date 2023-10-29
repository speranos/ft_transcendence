import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  signin(): string {
    return 'signin';
  }
  signup(): string {
      return 'signup';
  }
}
