import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import * as bcrypt from "bcrypt";
import { ApiProperty } from "@nestjs/swagger";

@Entity({ name: "users" })
export class User extends BaseEntity {
  @ApiProperty({
    description: "User ID",
    type: Number,
    required: true,
    example: 1,
  })
  @PrimaryGeneratedColumn({
    type: "int",
    comment: "User ID",
  })
  id: number;

  @ApiProperty({
    description: "User First name",
    type: String,
    required: true,
    example: "John",
  })
  @Column({
    type: "varchar",
    comment: "User first name",
  })
  first_name: string;

  @ApiProperty({
    description: "User Last name",
    type: String,
    required: true,
    example: "Snow",
  })
  @Column({
    type: "varchar",
    comment: "User last name",
  })
  last_name: string;

  @ApiProperty({
    description: "User email",
    type: String,
    required: true,
    example: "me@mail.com",
  })
  @Column({
    type: "varchar",
    unique: true,
    comment: "User email",
    length: 100,
  })
  email: string;

  @ApiProperty({
    description: "User password",
    type: String,
    required: true,
    example: "User password",
  })
  @Column({
    type: "varchar",
    comment: "User password",
  })
  password: string;

  @CreateDateColumn({
    type: "datetime",
    comment: "User created at",
  })
  created_at: Date;

  @UpdateDateColumn({
    type: "datetime",
    comment: "User updated at",
  })
  updated_at: Date;

  @BeforeInsert()
  async setPassword(password: string) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(password || this.password, salt);
  }
}
