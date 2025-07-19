import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { Handler, Context, Callback } from 'aws-lambda';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from "../src/app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";
import express from 'express';
import serverlessExpress from '@vendia/serverless-express';

const expressApp = express();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
  const configService = app.get(ConfigService);
  const port = configService.get<number>("PORT");

  // SWAGGER
  const config = new DocumentBuilder()
    .setTitle("Checkmyguest API")
    .setDescription("Official API Document for the Checkmyguest app")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  app.useGlobalPipes(new ValidationPipe());

  app.enableCors();

  // await app.listen(port || 3000);
  await app.init();
}

bootstrap();

export const handler: Handler = async (event: any, context: Context, callback: Callback) => {
  const server = serverlessExpress({ app: expressApp });
  return server(event, context, callback);
};