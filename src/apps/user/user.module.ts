import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStretegy } from './jwt/jwt-stretegy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './entities/user.repository';
import { systemConfig } from 'src/config/system.config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: systemConfig.jwt.secret_key,
      signOptions: {
        expiresIn: systemConfig.jwt.expire_in,
      },
    }),
    TypeOrmModule.forFeature([UserRepository]),
  ],
  controllers: [UserController],
  providers: [UserService, JwtStretegy],
  exports: [JwtStretegy, PassportModule],
})
export class UserModule {}
