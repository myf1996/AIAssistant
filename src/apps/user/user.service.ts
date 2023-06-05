import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './entities/user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload } from './jwt/jwt.payload';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, LoginResponseDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { SEND_EMAIL } from 'src/helper/send_mail';
import { systemConfig } from 'src/config/system.config';
import Status from './dto/status.enum';
import {
  ChangePasswordDto,
  ForgotPasswordDto,
  ForgotPasswordHashDto,
  ForgotPasswordHashResponseDto,
} from './dto/changepassword.dto';
import * as bcrypt from 'bcrypt';
import {
  generatePasswordHash,
  randomStringGenerator,
  validateUserPassword,
} from './user.util';
import { User } from './entities/user.entity';
import { UserQuery, UserResponseDto } from './dto/user.dto';
import { TokenDto } from './dto/token.dto';
import { ProfileDto } from './dto/profile.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,

    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<LoginResponseDto> {
    let password = dto.password;
    await this.userRepository.register(dto);
    dto.password = password;
    let login = await this.login(dto);
    SEND_EMAIL(
      dto.email, 
      `Welcome to ${systemConfig.project_name}`, 
      'register.html', {
        userEmail: dto.email,
        userName: login?.user?.name
      }
    );
    return login;
  }

  async login(dto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.userRepository.login(dto);
    user.status = Status.APPROVED;
    user.lastseen = `${new Date().getTime()}`;
    await user.save();
    const payload: JwtPayload = {
      id: user.id,
    };
    const accessToken = this.jwtService.sign(payload);
    return { user: user, accessToken };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.userRepository.getUserbyEmail(dto);
    const hash = await bcrypt.genSalt();
    user.emailVerifyHash = hash;
    await user.save();
    SEND_EMAIL(
      user.email,
      `${systemConfig.project_name} - Forgot Password Verification`,
      'forgotpassword.html', {
        userName: user?.name || '',
        forgotPasswordVerificationLink: `${systemConfig.application.frontend_base_url}/auth/verification-code?key=${hash}`
      }
    );
    return user;
  }

  async forgotPasswordVerify(
    dto: ForgotPasswordHashDto,
  ): Promise<ForgotPasswordHashResponseDto> {
    const user = await this.userRepository.findOne({
      emailVerifyHash: dto.key,
    });
    if (!user) {
      throw new UnauthorizedException('Invalid Key');
    }
    let password = randomStringGenerator(12);
    user.salt = await bcrypt.genSalt();
    user.password = await generatePasswordHash(password, user.salt);
    user.lastseen = `${new Date().getTime()}`;
    user.emailVerifyHash = null;
    await user.save();
    SEND_EMAIL(
      user.email,
      `${systemConfig.project_name} - Forgot Password Verification Done`,
      'forgotpasswordverification.html', {
        userEmail:user.email,
        userName: user?.name || '',
        userPassword: password,
      }
    );
    return { message: 'Random Password Generated sent to your email' };
  }

  async getProfile(user: User, query: UserQuery): Promise<User> {
    return await this.userRepository.getUserbyId(user.id, query);
  }

  async updateProfile(
    user: User,
    query: UserQuery,
    dto: ProfileDto,
  ): Promise<User> {
    dto.role = user.role;
    delete dto.password;
    delete dto.salt;
    return await this.userRepository.updateUserbyId(user.id, query, dto);
  }

  async changePassword(
    user: User,
    query: UserQuery,
    dto: ChangePasswordDto,
  ): Promise<User> {
    const u = await this.getProfile(user, query);
    const validUser = await validateUserPassword(u, dto.currentPassword);
    if (validUser) {
      if (dto.newPassword == dto.retypePassword) {
        let salt = await bcrypt.genSalt();
        return await this.userRepository.updateUserbyId(u.id, query, {
          salt: salt,
          password: await generatePasswordHash(dto.newPassword, salt),
        });
      } else {
        throw new UnauthorizedException("New & Retype Password Didn't Match");
      }
    } else {
      throw new UnauthorizedException('Invalid Previous Password');
    }
  }

  async tokenGenerate(
    query: UserQuery,
    dto: TokenDto,
  ): Promise<LoginResponseDto> {
    const user = await this.userRepository.getUserbyId(dto.id, query);
    const payload: JwtPayload = {
      id: user.id,
    };
    const accessToken = this.jwtService.sign(payload);
    return { user: user, accessToken };
  }
}
