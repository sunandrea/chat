import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { compare, genSalt, hash } from 'bcryptjs';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/update-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}
  async create(
    createUserDto: CreateUserDto,
  ): Promise<Omit<User, 'hashPassword'>> {
    const salt = await genSalt(10);

    const newUser = new this.userModel({
      email: createUserDto.email,
      name: createUserDto.name,
      passwordHash: await hash(createUserDto.password, salt),
    });

    const savedUser = await newUser.save();
    const userObject = savedUser.toObject();
    delete userObject.passwordHash;
    return userObject;
  }

  async validateUser(dto: LoginUserDto) {
    const user = await this.userModel.findOne({ email: dto.email });
    if (!user) throw new UnauthorizedException('Unauthorized');

    const isCorrectPassword = await compare(dto.password, user.passwordHash);
    if (!isCorrectPassword) throw new UnauthorizedException('Unauthorized');

    return { email: user.email, id: user._id.toString() };
  }

  async login(email: string, id: string) {
    const payload = { email, id };
    return { accessToken: await this.jwtService.signAsync(payload) };
  }

  async validateWithCookie(cookie: string) {
    try {
      const data = await this.jwtService.verifyAsync(cookie);
      console.log(`data`, data);
      if (!data) throw new UnauthorizedException();

      return data;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
