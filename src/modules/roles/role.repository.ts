import { CustomRepository } from "src/database/typeorm-ex.decorator";
import { Repository } from "typeorm";
import { Role } from "./dto/role.entity";

@CustomRepository(Role)
export class RoleRepository extends Repository<Role> {

}
