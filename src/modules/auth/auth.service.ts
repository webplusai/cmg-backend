import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { VALIDATION_ERROR_MESSAGES } from "src/common/constants/app.utils";
import {
  BadRequestException,
  UnauthorizedException,
} from "src/common/exceptions/systemErrors.exceptions";
import { RolesService } from "../roles/roles.service";
import { UserRoleService } from "../user-role/user-role.service";
import { UserRegisterRequestDto } from "../user/dto/user.dto";
import { User } from "../user/dto/user.entity";
import { UserService } from "../user/user.service";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private rolesService: RolesService,
    private userRoleService: UserRoleService,
    private jwtService: JwtService,
  ) {}

  async validateUserCredentials(
    email: string,
    password: string,
  ): Promise<User | undefined> {
    const user = await this.userService.getUser({
      where: { email },
    });
    if (!user) throw new BadRequestException("User not found with this email");

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) throw new UnauthorizedException("Invalid credentials");

    return user;
  }

  async registerUserByEmailAndPassword(userData: UserRegisterRequestDto) {
    try {
      const role = await this.rolesService.findRole({
        where: { name: userData.role },
      });
      if (!role) throw new Error(VALIDATION_ERROR_MESSAGES.RECORD_NOT_FOUND);
      const user = await this.userService.registerUser(userData);

      // create user-role record
      await this.userRoleService.newUserRole({
        role: role.id,
        user: user.id,
      });
      const response = this.generateToken(user);

      return response;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  generateToken(user: User): { access_token: string } {
    return {
      access_token: this.jwtService.sign({
        email: user.email,
        sub: user.id,
      }),
    };
  }
}
