// import { Module } from '@nestjs/common';
// import { AuthController } from './auth.controller';
// // import { AuthService } from './auth.service';
// import { JwtModule, JwtService } from '@nestjs/jwt';
// import { jwtConstants } from './constants';
// import { GoogleStrategy } from 'src/strategies/google.strategy';


// @Module({
//     imports: [JwtModule.register({
//         global: true,
//         secret: jwtConstants.secret,
//         signOptions: { expiresIn: '10s' },
//     }),
// ],
//     controllers: [AuthController],
//     providers: [AuthService, GoogleStrategy],
// })

// export class AuthModule {}