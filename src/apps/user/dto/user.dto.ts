import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { AbstractResponseDto } from 'src/helper/dto.abstract';
import { AbstractQuery } from 'src/helper/query.abstract';
import Role from './role.enum';
import Status from './status.enum';
import Gender from './gender.enum';

export class UserResponseDto extends AbstractResponseDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ nullable: true })
  phoneNumber: string;

  @ApiPropertyOptional({ nullable: true, enum: Gender })
  gender: Gender;

  @ApiProperty({ nullable: true })
  password: string;

  @ApiProperty({ nullable: true })
  salt: string;

  @ApiProperty({ nullable: true })
  emailVerifyHash: string;

  @ApiPropertyOptional({ nullable: true })
  lastseen: string;

  @ApiProperty({ enum: Role })
  role: Role;

  @ApiProperty({ enum: Status })
  status: Status;
}

export class AbstractUserResponseDto extends AbstractResponseDto {
  @ApiProperty({ type: () => UserResponseDto })
  user: UserResponseDto;
}

export class UserQuery extends AbstractQuery {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name: string;

  @ApiPropertyOptional({ enum: Role })
  @IsEnum(Role)
  @IsOptional()
  role: Role;

  @ApiPropertyOptional({ enum: Status })
  @IsEnum(Status)
  @IsOptional()
  status: Status;
}
