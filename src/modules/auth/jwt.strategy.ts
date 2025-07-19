import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { BadRequestException } from "src/common/exceptions/systemErrors.exceptions";
import appConfig from "src/config/app.config";
import { RolesService } from "../roles/roles.service";
import { UserRoleRepository } from "../user-role/user-role.repository";

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRoleRepository)
    private userRoleRepository: UserRoleRepository,
    private roleService: RolesService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: appConfig().appSecret,
    });
  }

  async validate(payload: {
    sub: string;
    email: string;
    iat?: number;
    exp?: number;
  }) {
    const { roles } = await this.getUserPermissions(payload.sub);

    return {
      id: payload.sub,
      email: payload.email,
      roles,
      // ... add more properties here as needed
    };
  }

  async getUserPermissions(sub: string): Promise<{ roles: string[] }> {
    const userRole = await this.userRoleRepository.findOne({
      where: { user: Number(sub) },
    });
    if (!userRole)
      throw new BadRequestException(
        "This user does not have any role assigned",
      );
    const role = await this.roleService.findRole({
      where: { id: userRole.role },
    });
    if (!role)
      throw new BadRequestException(
        "This user does not have any role assigned",
      );

    return { roles: [role.name] };
  }
}
