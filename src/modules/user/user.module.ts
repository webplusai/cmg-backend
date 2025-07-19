import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserRepository } from "./user.repository";
import { TypeOrmExModule } from "../../database/typeorm-ex.module";
import { UserRoleModule } from "../user-role/user-role.module";
import { RolesModule } from "../roles/roles.module";

@Module({
  controllers: [UserController],
  imports: [
    UserRoleModule,
    RolesModule,
    TypeOrmExModule.forCustomRepository([UserRepository]),
  ],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
