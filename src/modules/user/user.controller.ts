import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBody,
  ApiHeaders,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { Pagination } from "nestjs-typeorm-paginate";
import { APP_SETTINGS, USER_ROLES } from "../../common/constants/app.utils";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response";
import { GetUserRecordsRequestDto } from "../../common/type.definitions";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Roles } from "../auth/roles.decorator";
import { RolesGuard } from "../auth/roles.guard";
import { AdminCreateUserRequestDto, UserRoleUpdateDto } from "./dto/user.dto";
import { User } from "./dto/user.entity";
import { UserService } from "./user.service";

@UseGuards(JwtAuthGuard)
@ApiTags("Users")
@Controller("users")
export class UserController {
  constructor(private userService: UserService) { }

  @ApiHeaders([
    {
      name: "Authorization",
      description: "Bearer token",
    },
  ])
  @ApiResponse({
    status: 200,
    description: "The found record",
    type: User,
  })
  @UseGuards(JwtAuthGuard)
  @Get("me")
  async user(@Request() req): Promise<User> {
    return this.userService.getUser({
      where: { id: req.user.id },
    });
  }

  @ApiHeaders([
    {
      name: "Authorization",
      description: "Bearer token",
    },
  ])
  @ApiResponse({
    status: 200,
    description: "The found record",
    type: User,
  })
  @UseGuards(JwtAuthGuard)
  @Get("/find")
  async find(@Request() req): Promise<User> {
    return this.userService.getUser({
      where: req.query,
    });
  }

  @ApiQuery({
    name: "limit",
    description: "Number of records per page",
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: "page",
    description: "Page number",
    type: Number,
    required: false,
  })
  @ApiPaginatedResponse({
    model: User,
    description: "List of users",
  })
  @ApiHeaders([
    {
      name: "Authorization",
      description: "Bearer token",
    },
  ])
  @Get("/")
  @UseGuards(RolesGuard)
  @Roles(USER_ROLES.ADMIN)
  getUsers(
    @Request() req: unknown,
    @Query() query: GetUserRecordsRequestDto,
  ): Promise<Pagination<User>> {
    return this.userService.getUsers(query);
  }

  @Get("/:id")
  @ApiResponse({
    status: 200,
    description: "User details",
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: "User not found",
  })
  @ApiParam({
    name: "id",
    description: "User id",
    type: String,
    required: true,
  })
  @ApiHeaders([
    {
      name: "Authorization",
      description: "Bearer token",
    },
  ])
  @UseGuards(RolesGuard)
  @Roles(USER_ROLES.ADMIN, USER_ROLES.CUSTOMER)
  getUserById(@Param() params): Promise<User> {
    return this.userService.getUserById(params.id as string);
  }

  @ApiResponse({
    status: 201,
    description: "User created successfully",
    type: User,
  })
  @ApiBody({
    type: AdminCreateUserRequestDto,
    description: "User details",
  })
  @ApiHeaders([
    {
      name: "Authorization",
      description: "Bearer token",
    },
  ])
  @Post("/")
  @UseGuards(RolesGuard)
  @Roles(USER_ROLES.ADMIN)
  registerUser(
    @Request() req,
    @Body(APP_SETTINGS.VALIDATION_PIPE) userData: AdminCreateUserRequestDto,
  ): Promise<User> {
    return this.userService.adminRegisterUser(req, userData);
  }

  @ApiResponse({
    status: 201,
    description: "User role updated successfully",
    type: User,
  })
  @ApiBody({
    type: UserRoleUpdateDto,
    description: "User role details",
  })
  @ApiHeaders([
    {
      name: "Authorization",
      description: "Bearer token",
    },
  ])
  @UseGuards(RolesGuard)
  @Roles(USER_ROLES.ADMIN)
  @Patch("/role-update")
  updateUserRole(
    @Request() req,
    @Body(APP_SETTINGS.VALIDATION_PIPE) data: UserRoleUpdateDto,
  ): Promise<User> {
    return this.userService.updateUserRole(req, data);
  }

  @ApiResponse({
    status: 200,
    description: "User deleted successfully",
  })
  @ApiParam({
    name: "id",
    description: "User id",
    type: String,
    required: true,
  })
  @ApiHeaders([
    {
      name: "Authorization",
      description: "Bearer token",
    },
  ])
  @UseGuards(RolesGuard)
  @Roles(USER_ROLES.ADMIN)
  @Delete("/:id")
  deleteUser(@Request() req, @Param() params): Promise<void> {
    return this.userService.deleteUser(req, params.id);
  }
}
