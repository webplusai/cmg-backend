import { Body, Controller, Post, Request, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { validate } from "class-validator";
import { APP_SETTINGS } from "../../common/constants/app.utils";
import { UserRegisterRequestDto } from "../user/dto/user.dto";
import { UserService } from "../user/user.service";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/auth.dto";
import { LocalAuthGuard } from "./local-auth.guard";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post("register")
  async register(
    @Body(APP_SETTINGS.VALIDATION_PIPE) userData: UserRegisterRequestDto,
  ) {
    return this.authService.registerUserByEmailAndPassword(userData);
  }

  @UseGuards(LocalAuthGuard)
  @Post("login")
  async login(
    @Request() req,
    @Body() loginDto: LoginDto,
  ): Promise<{ access_token: string }> {
    await validate(loginDto);
    return this.authService.generateToken(req.user);
  }
}
