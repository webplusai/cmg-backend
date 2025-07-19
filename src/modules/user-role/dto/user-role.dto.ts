import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateUserRoleDto {
  @ApiProperty({
    description: 'Role ID to be assigned to the User',
    type: Number,
    required: true,
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  readonly role: number;

  @ApiProperty({
    description: 'User ID of the user to which the role is assigned',
    type: Number,
    required: true,
    example: 23,
  })
  @IsNotEmpty()
  @IsNumber()
  readonly user: number;
}
