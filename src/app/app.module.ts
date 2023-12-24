import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, registerAs } from '@nestjs/config';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ApiModule } from 'src/apis/api.module';
import { CryptoModule } from 'src/crypto/crypto.module';
import { DatabaseModule } from 'src/database/database.module';
import { JWTModule } from 'src/jwt/jwt.module';
import { PassportModule } from 'src/passport/passport.module';
import { RedisModule } from 'src/redis/redis.module';
import { AppController } from './app.controller';
import { providers } from './app.provider';
import { AppService } from './app.service';
import { PassportModule as NestPassportModule } from '@nestjs/passport';
import { APP_GUARD } from '@nestjs/core';
import { RoleGuard } from 'src/common/guards/role.guard';
import { GoogleStrategy } from 'src/passport/strategies/jwt/google.jwt.strategy';
import { AuthModule } from 'src/apis/auth/auth.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { options } from 'ormconfig';
import { MongoDBModule } from 'src/database/mongodb.module';

@Module({
	imports: [
    //    ClientsModule.register([
	// 	{
	// 		name: 'BILLING_SERVICE',
	// 		transport: Transport.KAFKA,
	// 		options: {
	// 			client: {
	// 				clientId: 'billing',
	// 				brokers: ['localhost:9092']
	// 			},
	// 			consumer: {
	// 				groupId: 'billing-consumer'
	// 			}
	// 		}
	// 	}
	//    ])
		//,
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: `.env`
		}),
		DevtoolsModule.register({
			http: process.env.NODE_ENV !== 'production'
		}),
		MulterModule.register({
			dest: './upload'
		}),
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '..', '..', '..', 'uploads')
		}),
		DatabaseModule,
		MongoDBModule,
		JWTModule,
		RedisModule,
		PassportModule,
		CryptoModule,
		ApiModule,
		AuthModule
	],
	controllers: [AppController],
	providers: [AppService, ...providers]
})
export class AppModule {}
