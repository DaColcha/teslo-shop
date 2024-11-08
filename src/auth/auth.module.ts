import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Type } from 'class-transformer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { Auth } from './decorators';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [
    TypeOrmModule.forFeature([
      User
    ]),

    PassportModule.register({ defaultStrategy: 'jwt' }),

    // JwtModule.register({ 
    //   secret: process.env.JWT_SECRET,
    //   signOptions: { expiresIn: '2h' },
    //  }),

    JwtModule.registerAsync({
      imports: [],
      inject: [],

      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '2h' }
      })
    })
    
  ],
  exports: [ TypeOrmModule, JwtStrategy, PassportModule, JwtModule ]
})
export class AuthModule {}
