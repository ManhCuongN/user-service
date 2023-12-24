import { Module } from '@nestjs/common';
import { PassportModule as NestPassportModule } from '@nestjs/passport';
import { AdminModule } from 'src/apis/admin/admin.module';
import { RedisModule } from 'src/redis/redis.module';
import { AdminStrategy } from './strategies/local/admin.local.strategy';
import { AuthService } from 'src/apis/auth/services/auth.service';
import { GoogleStrategy } from './strategies/jwt/google.jwt.strategy';
import { UserModule } from 'src/apis/user/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
	imports: [
		NestPassportModule,
		AdminModule,
		RedisModule,
		UserModule,
		NestPassportModule.register({
			defaultStrategy: 'jwt'
		}),
		JwtModule.register({
			secret: 'your_secret_key',
			signOptions: { expiresIn: '1h' }
		}),
	],
	providers: [AdminStrategy, GoogleStrategy]
})
export class PassportModule {}
