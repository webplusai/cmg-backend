import { CustomRepository } from "src/database/typeorm-ex.decorator";
import { Repository } from "typeorm";
import { UserRole } from "./dto/user-role.entity";
import { CreateUserRoleDto } from "./dto/user-role.dto";

@CustomRepository(UserRole)
export class UserRoleRepository extends Repository<UserRole> {

  async newUserRole(data: CreateUserRoleDto): Promise<UserRole> {
    const newRecord = this.create({
      role: data.role,
      user: data.user
    })
    return await newRecord.save()
  }
}
