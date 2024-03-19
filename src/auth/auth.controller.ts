import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() dto: CreateUserDto,
  ): Promise<Omit<User, 'hashPassword'>> {
    return await this.authService.create(dto);
  }

  @HttpCode(200)
  @Post('login')
  async login(
    @Body() dto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { email, id } = await this.authService.validateUser(dto);
    const jwt = await this.authService.login(email, id);
    res.cookie('jwt', jwt, { httpOnly: true });

    return jwt;
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('jwt');
    return { message: 'User logout' };
  }
}
