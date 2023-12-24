import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import * as argon2 from 'argon2';
import e, { Request, Response } from 'express';
import { SetCookieRFToken } from 'src/common/helpers/setCookieRFToken';
import { CryptoService } from 'src/crypto/crypto.service';
import { JwtService } from 'src/jwt/jwt.service';
import { RedisService } from 'src/redis/redis.service';
import { AdminService } from '../../admin/services/admin.service';

import { UserService } from 'src/apis/user/services/user.service';
import { JwtPayload } from 'src/jwt/jwt.interface';
import { UserEntity } from 'src/apis/user/entities/user.entity';

@Injectable()
export class AuthService {
	constructor(
		private readonly adminService: AdminService,
		private readonly jwtService: JwtService,
		private readonly redisService: RedisService,
		private readonly cryptoService: CryptoService
	) {}

	async generateAccessAndRefreshToken({ user }) {
		const { googleId, role, idUser } = user;

		try {
			const payload: JwtPayload = {
				id: idUser,
				role
			};

			const accessToken = await this.jwtService.signJwt(payload);
			const refreshToken = await this.jwtService.signJwt(payload, true);
			await this.redisService.setAccessToken(idUser, accessToken);
			await this.redisService.setRefreshToken(idUser, refreshToken);

			return { accessToken, refreshToken };
		} catch (error) {
			console.log('errorToken', error);
		}
	}

	// login(user: User, response: Response) {
	// 	const { id } = user;
	// 	const payload = { id };

	// 	// Generate accessToken
	// 	const accessToken = this.jwtService.signJwt(payload);
	// 	const refreshToken = this.jwtService.signJwt(payload, true);

	// 	//Cache token
	// 	this.redisService.setRefreshToken(id, refreshToken);
	// 	this.redisService.setAccessToken(id, accessToken);

	// 	//Encrypt cookie
	// 	const encryptId = this.cryptoService.encryptData(id);
	// 	SetCookieRFToken(response, encryptId);
	// 	const result = { user, accessToken };
	// 	return result;
	// }

	// async refreshToken(request: Request, userType: AdminType) {
	// 	const { sub } = request.cookies;

	// 	const decryptData = this.cryptoService.decryptData(sub);
	// 	const refreshToken = await this.redisService.getRefreshToken(decryptData);
	// 	// Get Token from refresh token
	// 	const user = await this.getUser(refreshToken, userType);
	// 	const { id } = user;
	// 	const accessToken = this.jwtService.signJwt({ id });
	// 	const result = { user, accessToken };
	// 	return result;
	// }

	// async getUser(refreshToken: string, userType: AdminType) {
	// 	const { id } = await this.jwtService.verifyJwt(refreshToken);
	// 	const where = { id };
	// 	const targetServices = this.getService(userType);
	// 	const user = await targetServices.getOne(where);
	// 	if (!user) {
	// 		throw new NotFoundException('User not found');
	// 	}
	// 	return user;
	// }

	// async changePassword(input: ChangePasswordDto, user: Admin, userType: AdminType) {
	// 	const { newPassword, oldPassword } = input;
	// 	const comparePassword = await argon2.verify(user.password, oldPassword);
	// 	if (!comparePassword) {
	// 		throw new BadRequestException({ oldPassword: 'Invalid old password' });
	// 	}
	// 	const hashedPassword = await argon2.hash(newPassword);
	// 	const targetServices = this.getService(userType);
	// 	return targetServices.updateById(user.id, { password: hashedPassword });
	// }

	// async logout(user: Admin) {
	// 	const sub = user.id;
	// 	this.redisService.delRFToken(sub);
	// 	this.redisService.delAccessToken(sub);
	// 	const result = { message: 'Logout successfully' };
	// 	return result;
	// }

	// getService(userType: AdminType) {
	// 	let targetServices: AdminService;
	// 	switch (userType) {
	// 		case 'admin':
	// 			targetServices = this.adminService;
	// 			break;
	// 	}
	// 	return targetServices;
	// }
}
