import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  Validate,
} from "class-validator";
import {
  ALLOWED_REG_ROLES,
  APP_SETTINGS,
  REGEX,
  USER_ROLES,
  VALIDATION_ERROR_MESSAGES,
} from "src/common/constants/app.utils";
import { AllowedRegRolesValidator } from "src/common/validators";

export class UserDto {
  @ApiProperty({
    description: "User Last name",
    type: String,
    required: true,
    example: "Snow",
  })
  @IsNotEmpty()
  @IsString()
  readonly last_name: string;

  @ApiProperty({
    description: "User First name",
    type: String,
    required: true,
    example: "John",
  })
  @IsNotEmpty()
  @IsString()
  readonly first_name: string;

  @ApiProperty({
    description: "User email",
    type: String,
    required: true,
    example: "User email",
  })
  @IsNotEmpty()
  @Length(1, 100)
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    description: "User password",
    type: String,
    required: true,
    example: "User password",
  })
  @IsNotEmpty()
  @Length(3, 24)
  // @Matches(REGEX.PASSWORD_RULE, {
  //   message: APP_SETTINGS.VALIDATION_ERROR_MESSAGES.PASSWORD_REGEX,
  // })
  password: string;

  @ApiProperty({
    description: "User confirm password",
    type: String,
    required: true,
    example: "User confirm password",
  })
  @IsNotEmpty()
  @Length(3, 24)
  // @Matches(REGEX.PASSWORD_RULE, {
  //   message: APP_SETTINGS.VALIDATION_ERROR_MESSAGES.PASSWORD_REGEX,
  // })
  confirm_password: string;

  @IsOptional()
  readonly created_at: Date;
}

export class UserRegisterRequestDto extends UserDto {
  @ApiProperty({
    name: "role",
    description: "Role of the user",
    type: String,
    required: true,
    example: ALLOWED_REG_ROLES.CUSTOMER,
  })
  @IsNotEmpty()
  @IsEnum(ALLOWED_REG_ROLES)
  @Validate(AllowedRegRolesValidator, {
    message: VALIDATION_ERROR_MESSAGES.ALLOWED_REG_ROLES,
  })
  role: ALLOWED_REG_ROLES;
}

export class AdminCreateUserRequestDto extends UserDto {
  @ApiProperty({
    name: "role",
    description: "Role of the user",
    type: String,
    required: true,
    example: USER_ROLES.CUSTOMER,
  })
  @IsNotEmpty()
  @IsEnum(USER_ROLES)
  role: USER_ROLES;
}

export class UserRoleUpdateDto {
  @ApiProperty({
    name: "role",
    description: "Role of the user",
    type: String,
    required: true,
    example: USER_ROLES.CUSTOMER,
  })
  @IsNotEmpty()
  @IsEnum(USER_ROLES)
  role: USER_ROLES;

  @ApiProperty({
    name: "user_id",
    description: "User id",
    type: String,
    required: true,
    example: 1,
  })
  @IsNotEmpty()
  @IsString()
  user_id: string;
}
