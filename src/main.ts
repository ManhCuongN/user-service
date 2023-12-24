import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app/app.module';
import { useSwagger } from './app/app.swagger';
import * as dotenv from 'dotenv';
import * as session from 'express-session';
import * as passport from 'passport';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as cors from 'cors';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
async function bootstrap() {
  dotenv.config();

  const app = await NestFactory.create(AppModule);

  // Cấu hình CORS cho phép từ tất cả các origin
  const corsOptions: CorsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  };

  app.enableCors();

  app.use(cookieParser());

  // Cấu hình express-session
  app.use(
    session({
      secret: 'your-secret-key', // Thay 'your-secret-key' bằng một chuỗi bất kỳ để mã hóa session
      resave: false,
      saveUninitialized: true,
      cookie: {
        // Cấu hình các thông số của cookie
        maxAge: 24 * 60 * 60 * 1000, // Thời gian sống của cookie (ở đây là 1 ngày)
        secure: false, // Nếu bạn sử dụng HTTPS, đặt true
        httpOnly: true, // Cookie chỉ có thể được truy cập qua HTTP (JavaScript không thể truy cập)
      },
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(passport.initialize());
  app.use(passport.session());
  app.setGlobalPrefix('/api/v1');
  app.use(cookieParser());
  useSwagger(app);

  const port = process.env.PORT || 3000;
  await app.listen(port);
}

bootstrap();
