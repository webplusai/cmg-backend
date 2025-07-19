import { ConfigModule, ConfigService } from "@nestjs/config";
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from "@nestjs/typeorm";

console.log('DB_HOST TypeORM: ', process.env.DB_HOST);
console.log('DB_PORT TypeORM: ', process.env.DB_PORT);
console.log('DB_USER TypeORM: ', process.env.DB_USER);
console.log('DB_PASSWORD TypeORM: ', process.env.DB_PASSWORD);
console.log('DB_NAME TypeORM: ', process.env.DB_NAME);

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (): Promise<TypeOrmModuleOptions> => {
    return {
      type: "mysql",
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || "3306"),
      username: process.env.DB_USER,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      entities: [__dirname + "/../**/*.entity.{js,ts}"],
      migrations: [__dirname + "/../migrations/*.{js,ts}"],
      extra: {
        charset: "utf8mb4_unicode_ci",
        connectionTimeoutMillis: 180000
      },
      synchronize: process.env.DB_SYNC === "true",
      logging: process.env.SHOULD_LOG === "true",
    };
  },
};

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: "mysql",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "3306"),
  username: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  entities: [__dirname + "/../**/*.entity.{js,ts}"],
  migrations: [__dirname + "/../database/migrations/*{.ts,.js}"],
  extra: {
    charset: "utf8mb4_unicode_ci",
  },
  logging: true,
};
