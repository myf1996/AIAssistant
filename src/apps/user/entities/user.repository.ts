import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { systemConfig } from './../../../config/system.config';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { generatePasswordHash, validateUserPassword } from '../user.util';
import { RegisterDto } from '../dto/register.dto';
import { UserQuery, UserResponseDto } from '../dto/user.dto';
import { LoginDto } from '../dto/login.dto';
import { ProfileDto } from '../dto/profile.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async register(dto: RegisterDto): Promise<User> {
    dto.salt = await bcrypt.genSalt();
    dto.password = await generatePasswordHash(dto.password, dto.salt);
    return await this.createUser(dto);
  }

  async login(dto: LoginDto): Promise<User> {
    let user = await this.getUserbyEmail(dto);
    const validateUserCredentials = await validateUserPassword(
      user,
      dto.password,
    );
    if (user && validateUserCredentials) {
      return user;
    } else {
      throw new UnauthorizedException('Invalid Credentials');
    }
  }
  async createUser(dto): Promise<User> {
    let user = this.create();
    user.name = dto.name;
    user.email = dto.email;
    user.phoneNumber = dto.phoneNumber;
    user.gender = dto.gender;
    user.password = dto.password;
    user.salt = dto.salt;
    user.emailVerifyHash = dto.emailVerifyHash;
    user.lastseen = `${new Date().getTime()}`;
    user.role = dto.role;
    try {
      return await user.save();
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Email Already Exists');
      }
      console.log(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }
  async getAllUser(query: UserQuery): Promise<User[]> {
    let qs = this.createQueryBuilder('user');
    if (systemConfig.database.fetch_data_with_deleted) {
      qs = qs.withDeleted();
    }
    if (query.name) {
      qs = qs.andWhere('contract.name ILIKE :name', {
        name: `%${query.name}%`,
      });
    }
    if (query.role) {
      qs = qs.andWhere('user.role =:role', {
        role: `${query.role}`,
      });
    }
    if (query.status) {
      qs = qs.andWhere('user.status =:status', {
        status: `${query.status}`,
      });
    }
    return await qs
      .orderBy(`user.${query.order || 'createdAt'}`, query.sort || 'DESC')
      .skip(Number(query.skip) || 0)
      .take(Number(query.take) || 20)
      .getMany();
  }

  async getUserbyId(id, query) {
    let qs = this.createQueryBuilder('user');
    qs = qs.andWhere('user.id =:id', {
      id: id,
    });

    if (systemConfig.database.fetch_data_with_deleted) {
      qs = qs.withDeleted();
    }
    let result = await qs.getOne();
    if (result) {
      return result;
    }
    throw new NotFoundException('User Not Found');
  }

  async getUserbyEmail(dto): Promise<User> {
    // dto: LoginDto
    let qs = this.createQueryBuilder('user');
    qs = qs.andWhere('user.email =:email', {
      email: dto.email,
    });
    if (systemConfig.database.fetch_data_with_deleted) {
      qs = qs.withDeleted();
    }
    const result = await qs.getOne();
    if (result) {
      return result;
    }
    throw new NotFoundException('User Not Found');
  }

  async updateUserbyId(id: string, query: UserQuery, dto): Promise<User> {
    //dto: ProfileDto
    let user = await this.getUserbyId(id, query);
    user.name = dto.name;
    user.email = dto.email;
    user.phoneNumber = dto.phoneNumber;
    user.gender = dto.gender;
    user.password = dto.password;
    user.salt = dto.salt;
    user.emailVerifyHash = dto.emailVerifyHash;
    user.lastseen = dto.lastseen;
    user.role = dto.role;
    user.status = dto.status;
    try {
      return await user.save();
    } catch (error) {
      if (error.code === '23505') {
        console.log(error.message);
        throw new ConflictException('Email Already Exists');
      }
      console.log(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteUserbyId(id: string, query: UserQuery): Promise<User> {
    let user = await this.getUserbyId(id, query);
    await this.softDelete(id);
    return user;
  }
}
