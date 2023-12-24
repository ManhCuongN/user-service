import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AdminModule } from '../admin/admin.module';
import { AuthAdminController } from './controllers/auth.admin.controller';
import { AuthService } from './services/auth.service';
import { AuthGuard, PassportModule } from '@nestjs/passport';

import { AuthUserController } from './controllers/auth.user.controller';
import { AdminStrategy } from 'src/passport/strategies/local/admin.local.strategy';
import { GoogleStrategy } from 'src/passport/strategies/jwt/google.jwt.strategy';
import { UserModule } from '../user/user.module';


@Module({
	imports: [
		AdminModule,
		UserModule,
		
	],
	providers: [AuthService, AdminStrategy, GoogleStrategy],
	controllers: [AuthAdminController, AuthUserController],
})
export class AuthModule {}

 