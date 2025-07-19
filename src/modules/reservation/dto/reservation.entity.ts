import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "reservations" })
export class Reservation extends BaseEntity {
  @PrimaryGeneratedColumn({
    type: "int",
  })
  id: number;

  @Column({
    type: "varchar",
  })
  space_id: string;

  @Column({
    type: "varchar",
  })
  user_id: string;

  @Column({
    type: "varchar",
  })
  reserved_by: string;

  @CreateDateColumn()
  start_date: Date;

  @CreateDateColumn()
  end_date: Date;

  @Column({
    type: "varchar",
  })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
