import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import cloudinaryConfig from "../../config/cloudinary.config";
import { FileUploadService } from "./file-upload.service";
import { FileUploadController } from "./file-upload.controller";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, load: [cloudinaryConfig] })],
  controllers: [FileUploadController],
  providers: [FileUploadService],
})
export class FileUploadModule {}
