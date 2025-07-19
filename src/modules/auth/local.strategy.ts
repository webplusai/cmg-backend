import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';
import { UnauthorizedException } from 'src/common/exceptions/systemErrors.exceptions';
import { User } from '../user/dto/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(email: string, password: string): Promise<User | undefined> {
    const user = await this.authService.validateUserCredentials(email, password);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    return user;
  }
}
