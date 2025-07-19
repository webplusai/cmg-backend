import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "spaces" })
export class Space extends BaseEntity {
  @PrimaryGeneratedColumn({
    type: "int",
  })
  id: number;

  @Column({
    type: "varchar",
    unique: true,
  })
  name: string;

  @Column({
    type: "varchar",
  })
  location: string;

  @Column({
    type: "integer",
  })
  square_meters: number;

  @Column({
    type: "varchar",
  })
  price: number;

  @Column({
    type: "varchar",
  })
  currency: string;

  @Column({
    type: "varchar",
  })
  latitude: string;

  @Column({
    type: "varchar",
  })
  longitude: string;

  @Column({
    type: "varchar",
    length: 5000
  })
  images: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
