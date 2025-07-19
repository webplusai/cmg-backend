import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserRepository } from '../user/user.repository';
import { TypeOrmExModule } from 'src/database/typeorm-ex.module';
import { LocalStrategy } from './local.strategy';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { jwtConfig } from 'src/config/jwt.config';
import { JwtStrategy } from './jwt.strategy';
import { UserRoleRepository } from '../user-role/user-role.repository';
import { UserRoleModule } from '../user-role/user-role.module';
import { RolesModule } from '../roles/roles.module';

@Module({
  controllers: [AuthController],
  imports: [
    UserModule,
    UserRoleModule,
    RolesModule,
    PassportModule,
    JwtModule.registerAsync(jwtConfig),
    TypeOrmExModule.forCustomRepository([
      UserRepository,
      UserRoleRepository
    ]),
  ],
  providers: [AuthService, JwtStrategy, LocalStrategy]
})
export class AuthModule {}
