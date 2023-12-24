import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import * as argon2 from 'argon2';
import { Strategy } from 'passport-local';
import { AdminService } from 'src/apis/admin/services/admin.service';
import { UserService } from 'src/apis/user/services/user.service';
import { StrategyKey } from 'src/common/constant';

@Injectable()
export class AdminStrategy extends PassportStrategy(Strategy, StrategyKey.LOCAL.USER) {
	constructor(private readonly userService: UserService) {
		super({
			usernameField: 'phoneOrEmail',
			passwordField: 'password'
		});
	}

	async validate(phoneOrEmail: string, password: string) {
		const where = phoneOrEmail.includes('@')
			? { email: phoneOrEmail }
			: { phone: phoneOrEmail };
		const admin = await this.userService.getOneOrFail(where);
		const comparePassword = await argon2.verify(admin.password, password);
		if (!comparePassword) {
			throw new UnauthorizedException('Invalid password');
		}
		
		return admin;
	}
}
