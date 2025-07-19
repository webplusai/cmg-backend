import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseService } from "src/common/BaseService";
import { UserRoleRepository } from "./user-role.repository";
import { RecordNotFoundException } from "src/common/exceptions/systemErrors.exceptions";
import { VALIDATION_ERROR_MESSAGES } from "src/common/constants/app.utils";
import { QueryConfig } from "src/common/type.definitions";
import { UserRole } from "./dto/user-role.entity";
import { CreateUserRoleDto } from "./dto/user-role.dto";

@Injectable()
export class UserRoleService extends BaseService {
  constructor(
    @InjectRepository(UserRoleRepository)
    private userRoleRepository: UserRoleRepository,
  ) {
    super();
  }

  async findUserRole(
    query?: Pick<QueryConfig, "where"> & {
      select?: (keyof UserRole)[];
    },
  ): Promise<UserRole> {
    const data = await this.userRoleRepository.findOne({
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

  async newUserRole(data: CreateUserRoleDto) {
    return this.userRoleRepository.newUserRole(data);
  }

  async updateUserRole(data: Partial<UserRole>) {
    return this.userRoleRepository.update(data.id as number, data);
  }

  async deleteUserRole(id: number): Promise<void> {
    await this.userRoleRepository.delete(id);
    return;
  }
}
