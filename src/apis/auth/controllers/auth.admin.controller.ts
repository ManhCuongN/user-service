import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StrategyKey } from 'src/common/constant';
import { AdminEntity } from '../../admin/entities/admin.entity';
import { AuthService } from '../services/auth.service';
import { AuthBaseController } from './auth.base.controller';
import { UserService } from 'src/apis/user/services/user.service';

@ApiTags('Auth API For Admin')
@Controller('/auth/admin')
export class AuthAdminController extends AuthBaseController<AdminEntity>() {
	constructor(
		public readonly authService: AuthService,
		public readonly userService: UserService
	) {
		super(authService, userService);
	}
}
