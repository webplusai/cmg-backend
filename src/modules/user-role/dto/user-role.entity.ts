import { ApiProperty } from "@nestjs/swagger";
import { Role } from "../../../modules/roles/dto/role.entity";
import { User } from "../../../modules/user/dto/user.entity";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "user_roles" })
export class UserRole extends BaseEntity {
  @PrimaryGeneratedColumn({
    type: "int",
  })
  id: number;

  @ApiProperty({
    description: "User id",
  })
  @Column({
    type: "int",
    unique: true,
  })
  @OneToOne(() => User, (user) => user.id)
  user: number;

  @ApiProperty({
    description: "Role id",
  })
  @Column({
    type: "int",
  })
  @OneToOne(() => Role, (role) => role.id)
  role: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
