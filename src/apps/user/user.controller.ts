import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { LoginDto, LoginResponseDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserQuery, UserResponseDto } from './dto/user.dto';
import {
  ChangePasswordDto,
  ForgotPasswordDto,
  ForgotPasswordHashDto,
} from './dto/changepassword.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { ProfileDto } from './dto/profile.dto';

@ApiTags('Auth/User Module')
@Controller('account')
@UsePipes(ValidationPipe)
@ApiBadRequestResponse({ description: 'BadRequest.' })
@ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
export class UserController {
  constructor(private userService: UserService) {}

  @Post('register')
  @ApiResponse({ status: 200, type: LoginResponseDto })
  async register(@Body() dto: RegisterDto) {
    return await this.userService.register(dto);
  }

  @Post('login')
  @ApiResponse({ status: 200, type: LoginResponseDto })
  async login(@Body() dto: LoginDto) {
    return await this.userService.login(dto);
  }

  @Post('forgot-password')
  @ApiResponse({ status: 200, type: UserResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return await this.userService.forgotPassword(dto);
  }

  @Post('forgot-password/hash')
  @ApiResponse({ status: 200, type: UserResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async forgotPasswordVerify(@Body() dto: ForgotPasswordHashDto) {
    return await this.userService.forgotPasswordVerify(dto);
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: 200, type: UserResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async getProfile(@GetUser() user: User, @Query() query: UserQuery) {
    console.log('profile controller');
    return await this.userService.getProfile(user, query);
  }

  @Patch('profile')
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: 200, type: UserResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async updateProfile(
    @GetUser() user: User,
    @Query() query: UserQuery,
    @Body() dto: ProfileDto,
  ) {
    return await this.userService.updateProfile(user, query, dto);
  }

  @Post('change-password')
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: 200, type: UserResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async changePassword(
    @GetUser() user: User,
    @Query() query: UserQuery,
    @Body() dto: ChangePasswordDto,
  ) {
    return await this.userService.changePassword(user, query, dto);
  }
}
