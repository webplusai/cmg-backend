import { USER_ROLES } from "../../common/constants/app.utils";
import { Role } from "../../modules/roles/dto/role.entity";
import { define } from "typeorm-seeding";

interface RoleContext {
  name?: string;
}

define(Role, (_, context: RoleContext) => {
  const { name } = context;
  const role = new Role();
  role.name = name || USER_ROLES.ADMIN;
  return role;
});
