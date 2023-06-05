import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { UserResponseDto } from './user.dto';
import { User } from '../entities/user.entity';
import { ForgotPasswordDto } from './changepassword.dto';

export class LoginDto extends ForgotPasswordDto {
  @ApiProperty()
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class LoginResponseDto {
  @ApiProperty({ type: () => UserResponseDto })
  user: User;

  @ApiProperty()
  accessToken: string;
}
