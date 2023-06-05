import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UnauthorizedException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload } from './jwt.payload';
import { systemConfig } from 'src/config/system.config';
import { UserRepository } from '../entities/user.repository';

@Injectable()
export class JwtStretegy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: systemConfig.jwt.secret_key,
    });
  }

  async validate(payload: JwtPayload) {
    let user = await this.userRepository.getUserbyId(payload.id, {});
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
