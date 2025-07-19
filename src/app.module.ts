import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./modules/auth/auth.module";
import { UserModule } from "./modules/user/user.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeOrmAsyncConfig } from "./config/typeorm.config";
import { UserRoleModule } from "./modules/user-role/user-role.module";
import { RolesModule } from "./modules/roles/roles.module";
import { SpaceModule } from "./modules/space/space.module";
import cloudinaryConfig from "./config/cloudinary.config";
import { FileUploadModule } from "./modules/file-upload/file-upload.module";
import { SpaceReservationModule } from "./modules/reservation/reservation.module";

@Module({
  imports: [
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
      load: [cloudinaryConfig],
    }),
    AuthModule,
    UserModule,
    UserRoleModule,
    RolesModule,
    SpaceModule,
    FileUploadModule,
    SpaceReservationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
