import { Controller, Post, Body, HttpCode, UseGuards, Get, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StrategyKey } from 'src/common/constant';
import { AdminEntity } from '../../admin/entities/admin.entity';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { LoginDto } from '../dtos/login.dto';
import { AuthAdmin } from 'src/common/decorators/auth-admin.decorator';

import { AuthBaseController } from './auth.base.controller';
import { UserEntity } from 'src/apis/user/entities/user.entity';
import { AuthUser } from 'src/common/decorators/auth-user.decorator';
import { Roles } from 'src/common/enums/role.enum';
import { User } from 'src/common/decorators/user.decorator';
import { RoleGuard } from 'src/common/guards/role.guard';
import { UserService } from 'src/apis/user/services/user.service';

@ApiTags('Auth API For User')
@Controller('/auth/user')
export class AuthUserController extends AuthBaseController<UserEntity>() {
	constructor(
		public readonly authService: AuthService,
		public readonly userService: UserService
	) {
		super(authService, userService);
	}

	//   @Post('login')
	//   @HttpCode(200)
	//   @UseGuards(AuthGuard(StrategyKey.LOCAL.ADMIN))
	//   async login(
	//     @Body() _login: LoginDto,
	//     @Res({ passthrough: true }) response: Response
	//   ) {
	//     const userData = await this.authService.getUserData(); // Lấy thông tin người dùng từ service
	//     return this.authService.login(userData, response);
	//   }
}
