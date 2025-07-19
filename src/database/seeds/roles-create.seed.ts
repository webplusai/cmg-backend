import { USER_ROLES } from "../../common/constants/app.utils";
import { Role } from "../../modules/roles/dto/role.entity";
import { getManager } from "typeorm";
import { Factory, Seeder } from "typeorm-seeding";

export class RoleCreateSeed implements Seeder {
  public async run(factory: Factory): Promise<void> {
    await getManager().query(`TRUNCATE roles`);

    await factory(Role)({ name: USER_ROLES.ADMIN }).create();
    await factory(Role)({ name: USER_ROLES.CUSTOMER }).create();
  }
}
