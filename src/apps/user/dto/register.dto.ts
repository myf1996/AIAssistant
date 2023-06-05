import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  ValidateNested,
} from 'class-validator';
import Role from './role.enum';
import Gender from './gender.enum';

export class RegisterDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiPropertyOptional()
  @IsString()
  @IsEnum(Gender)
  @IsOptional()
  gender: Gender;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  salt: string;

  @ApiProperty({ enum: Role })
  @IsString()
  @IsNotEmpty()
  @IsEnum(Role)
  role: Role;
}
