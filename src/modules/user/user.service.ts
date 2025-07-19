import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from "nestjs-typeorm-paginate";
import { BaseService } from "../../common/BaseService";
import {
  BadRequestException,
  RecordNotFoundException,
} from "../../common/exceptions/systemErrors.exceptions";
import {
  GetUserRecordsRequestDto,
  QueryConfig,
} from "../../common/type.definitions";
import { Role } from "../roles/dto/role.entity";
import { UserRole } from "../user-role/dto/user-role.entity";
import {
  AdminCreateUserRequestDto,
  UserRegisterRequestDto,
  UserRoleUpdateDto,
} from "./dto/user.dto";
import { User } from "./dto/user.entity";
import { UserRepository } from "./user.repository";
import { RolesService } from "../roles/roles.service";
import { UserRoleService } from "../user-role/user-role.service";
import {
  USER_ROLES,
  VALIDATION_ERROR_MESSAGES,
} from "../../common/constants/app.utils";
import { Request } from "express";

@Injectable()
export class UserService extends BaseService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    private rolesService: RolesService,
    private userRoleService: UserRoleService,
  ) {
    super();
  }

  private createBaseQueryBuilder() {
    return this.userRepository
      .createQueryBuilder("u")
      .leftJoinAndMapOne("u.user_role", UserRole, "ur", "ur.user = u.id")
      .leftJoinAndMapOne("ur.role", Role, "r", "r.id = ur.role")
      .select([
        "u.id",
        "u.first_name",
        "u.last_name",
        "u.email",
        "u.created_at",
        "u.updated_at",
        "ur.id",
        "ur.user",
        "r.name",
      ]);
  }

  /**
   * This method registers a new user
   * @param userData
   * @returns
   */
  async registerUser(
    userData: UserRegisterRequestDto | AdminCreateUserRequestDto,
  ): Promise<User> {
    return this.userRepository.registerUser(userData);
  }

  /**
   * This method registers a new user by an admin
   * @param request
   * @param userData
   * @returns Promise<User>
   */
  async adminRegisterUser(
    request: Request,
    userData: AdminCreateUserRequestDto,
  ): Promise<User> {
    try {
      if (
        !(request.user as { roles: USER_ROLES }).roles.includes(
          USER_ROLES.ADMIN,
        )
      )
        throw new Error(VALIDATION_ERROR_MESSAGES.UNAUTHORIZED);
      const role = await this.rolesService.findRole({
        where: { name: userData.role },
      });
      if (!role) throw new Error(VALIDATION_ERROR_MESSAGES.RECORD_NOT_FOUND);
      const user = await this.registerUser(userData);
      // create user-role record
      await this.userRoleService.newUserRole({
        role: role.id,
        user: user.id,
      });
      return user;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * This method returns a single user
   * @param config
   * @returns Promise<User>
   */
  async getUser(
    query?: Pick<QueryConfig, "where"> & {
      select?: (keyof User)[];
    },
  ): Promise<User> {
    const data = await this.userRepository.findOne({
      where: query?.where,
      select: query?.select,
    });

    if (!data) {
      throw new RecordNotFoundException("User not found");
    }

    return data;
  }

  /**
   * This method returns the list of users
   * @param request
   * @param query
   * @returns Promise<Pagination<User>>
   */
  async getUsers(query: GetUserRecordsRequestDto): Promise<Pagination<User>> {
    const queryBuilder = this.createBaseQueryBuilder();

    return paginate<User>(queryBuilder, query as IPaginationOptions);
  }

  /**
   * This method returns a single user
   * @param id
   * @returns
   */
  async getUserById(id: string) {
    const queryBuilder = this.createBaseQueryBuilder();

    const data = await queryBuilder.where("u.id = :id", { id }).getOne();

    if (!data) {
      throw new RecordNotFoundException("User not found");
    }

    return data;
  }

  async updateUserRole(
    request: Request,
    data: UserRoleUpdateDto,
  ): Promise<User> {
    if (
      !(request.user as { roles: USER_ROLES }).roles.includes(USER_ROLES.ADMIN)
    )
      throw new Error(VALIDATION_ERROR_MESSAGES.UNAUTHORIZED);
    const role = await this.rolesService.findRole({
      where: { name: data.role },
    });
    if (!role) throw new Error(VALIDATION_ERROR_MESSAGES.ALLOWED_REG_ROLES);

    const user = await this.getUserById(data.user_id);
    if (!user) throw new Error(VALIDATION_ERROR_MESSAGES.RECORD_NOT_FOUND);

    // update user-role record if it exists else create a new one
    try {
      const userRole = await this.userRoleService.findUserRole({
        where: { user: user.id },
      });
      userRole.role = role.id;
      await this.userRoleService.updateUserRole(userRole);
    } catch (error) {
      await this.userRoleService.newUserRole({
        role: role.id,
        user: user.id,
      });
    }

    return this.getUserById(data.user_id);
  }

  async deleteUser(request: Request, id: string): Promise<void> {
    if (
      !(request.user as { roles: USER_ROLES }).roles.includes(USER_ROLES.ADMIN)
    )
      throw new Error(VALIDATION_ERROR_MESSAGES.UNAUTHORIZED);
    const user = await this.getUserById(id);
    if (!user) throw new Error(VALIDATION_ERROR_MESSAGES.RECORD_NOT_FOUND);
    const userRole = await this.userRoleService.findUserRole({
      where: { user: user.id },
    });
    await this.userRoleService.deleteUserRole(userRole.id);
    await this.userRepository.deleteUser(user.id);
    return;
  }
}
