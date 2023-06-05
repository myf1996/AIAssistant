import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty()
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class ForgotPasswordHashDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  key: string;
}

export class ForgotPasswordHashResponseDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  message: string;
}

export class ChangePasswordDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  newPassword: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  retypePassword: string;
}
