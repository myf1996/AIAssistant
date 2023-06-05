import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import Gender from './gender.enum';
import Role from './role.enum';
import { UserResponseDto } from './user.dto';

export class ProfileDto extends UserResponseDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  phoneNumber: string;

  @ApiPropertyOptional({ enum: Gender })
  @IsString()
  @IsEnum(Gender)
  @IsOptional()
  gender: Gender;

  @ApiPropertyOptional({ enum: Role })
  @IsString()
  @IsEnum(Role)
  @IsOptional()
  role: Role;
}
