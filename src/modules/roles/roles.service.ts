import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RoleRepository } from "./role.repository";
import { QueryConfig } from "../../common/type.definitions";
import { BaseService } from "../../common/BaseService";
import { Role } from "./dto/role.entity";
import { RecordNotFoundException } from "../../common/exceptions/systemErrors.exceptions";
import { VALIDATION_ERROR_MESSAGES } from "../../common/constants/app.utils";

@Injectable()
export class RolesService extends BaseService {
  constructor(
    @InjectRepository(RoleRepository) private roleRepository: RoleRepository,
  ) {
    super();
  }

  async findRole(
    query?: Pick<QueryConfig, "where"> & {
      select?: (keyof Role)[];
    },
  ): Promise<Role> {
    const data = await this.roleRepository.findOne({
      where: query?.where,
      select: query?.select,
    });

    if (!data) {
      throw new RecordNotFoundException(
        VALIDATION_ERROR_MESSAGES.RECORD_NOT_FOUND,
      );
    }

    return data;
  }
}
