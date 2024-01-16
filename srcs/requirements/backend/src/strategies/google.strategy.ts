import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(){
    super({
      clientID: '930657007587-apilst3cuj4rb3u0nl8i4778jvfav509.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'http://localhost:3000/google/redir',
      scope: ['profile', 'email'],
    });

  }

async validate(accessToken: string, refreshToken: string, profile: Profile)
{
    // const { id, name, emails, photos } = profile;

    // const user = {
    //   provider: 'google',
    //   providerId: id,
    //   email: emails[0].value,
    //   name: `${name.givenName} ${name.familyName}`,
    //   picture: photos[0].value,
    // };
    console.log(accessToken); 
    console.log(profile);
    // done(null, user);clt[sck].buf[j]
  }
}