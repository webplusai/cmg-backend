import { Module } from "@nestjs/common";
import { SpaceController } from "./space.controller";
import { SpaceService } from "./space.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Space } from "./dto/space.entity";
import { FileUploadService } from "../file-upload/file-upload.service";
import { Reservation } from "../reservation/dto/reservation.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Space, Reservation])
  ],
  controllers: [SpaceController],
  providers: [SpaceService, FileUploadService],
})
export class SpaceModule { }
