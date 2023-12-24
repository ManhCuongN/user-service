import {
	Body,
	Get,
	HttpCode,
	HttpException,
	HttpStatus,
	Post,
	Req,
	Res,
	UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { AdminEntity } from 'src/apis/admin/entities/admin.entity';
import { AuthAdmin } from 'src/common/decorators/auth-admin.decorator';
import { ApiChangePassword, ApiLogin, ApiLogout, ApiRefreshToken } from '../auth.swagger';
import { LoginDto } from '../dtos/login.dto';
import { UserType } from '../interfaces/auth.interface';
import { AuthService } from '../services/auth.service';
import { UserEntity } from 'src/apis/user/entities/user.entity';
import { RoleGuard } from 'src/common/guards/role.guard';
import { User } from 'src/common/decorators/user.decorator';
import { AuthUser } from 'src/common/decorators/auth-user.decorator';
import { Roles } from 'src/common/enums/role.enum';
import { UserService } from 'src/apis/user/services/user.service';
import { JwtRequestGuard } from 'src/common/guards/jwt-request.guard';
import { GoogleStrategy } from 'src/passport/strategies/jwt/google.jwt.strategy';

export const AuthBaseController = <Entity extends UserEntity | AdminEntity>() => {
	class BaseController {
		constructor(
			public readonly authService: AuthService,
			public readonly userService: UserService
		) {}

		@Get('/google')
		@UseGuards(AuthGuard('google'))
		googleLogin(@Req() req) {
			console.log(req.user);
		}

		@Get('auth/google/callback')
		@UseGuards(AuthGuard('google'))
		async callback(@Req() req, @Res() res) {
			try {
				const result = await this.authService.generateAccessAndRefreshToken(req.user);

				// Lưu result vào session
				const accessToken = result?.accessToken;
				const refreshToken = result?.refreshToken;

				// Trả về mã thông báo (token) trong URL query
				return res.redirect(
					`http://localhost:3006/login?accessToken=${accessToken}&refreshToken=${refreshToken}`
				);
			} catch (error) {
				// Xử lý lỗi nếu cần thiết
				console.error(error);
				throw new HttpException('Error during callback', HttpStatus.INTERNAL_SERVER_ERROR);
			}
		}

		@Get('/get')
		@HttpCode(200)
		async getCo(@Req() req) {
			// Đọc cookie trong hàm getCo
			const user = req.session.user;

			console.log('Giá trị cookie:', user);

			// Trả về dữ liệu hoặc thông báo cho client
			return { cookieValue: user };
		}

		@Get('/get/information')
		@HttpCode(200)
		@UseGuards(JwtRequestGuard)
		async infomationUser(@User() user) {
			return user;
		}
		// @Post('login')
		// @HttpCode(200)
		// @ApiLogin(userType)
		// @UseGuards(AuthGuard(strategyKey))
		// async login(
		// 	@Body() _login: LoginDto, // Load to Swagger
		// 	@User() userData: Entity,
		// 	@Res({ passthrough: true }) response: Response
		// ) {
		// 	return this.authService.login(userData, response);
		// }

		// @Get('refresh-token')
		// @ApiRefreshToken(userType)
		// async refreshToken(@Req() request: Request) {
		// 	return this.authService.refreshToken(request, userType);
		// }

		// @Post('change-password')
		// @HttpCode(200)
		// @ApiChangePassword(userType)
		// @AuthAdmin()
		// async changePassword(@Body() body: ChangePasswordDto, @User() user: Entity) {
		// 	return this.authService.changePassword(body, user, userType);
		// }

		// @Get('logout')
		// @HttpCode(200)
		// @ApiLogout(userType)
		// @AuthAdmin()
		// async logout(@User() user: Entity) {
		// 	return this.authService.logout(user);
		// }
	}

	return BaseController;
};
