import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //add global validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true
  }))
  //set route prefix
  app.setGlobalPrefix('api');
  //cookie parser
  app.use(cookieParser());

  //handle cors
  const corsOptions = {
    origin: ['http://localhost:3000', '*'],
    methods: ['GET', 'HEAD', 'PUT','POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }
  app.enableCors(corsOptions);
  
  await app.listen(process.env.PORT ?? 5000);
  console.log(`Server is listening on ${await app.getUrl()}/api`)
}
bootstrap().catch((error) => {
  console.log(error);
  process.exit(1)
});
