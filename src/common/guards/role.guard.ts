import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { MetadataKey } from '../constant';
import { Roles } from '../enums/role.enum';
import { JwtService } from 'src/jwt/jwt.service';

@Injectable()
export class RoleGuard implements CanActivate {
	constructor(private readonly reflector: Reflector, private readonly jwtService: JwtService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const requiredRoles = this.reflector.getAllAndOverride<Roles[]>(MetadataKey.ROLE, [
			context.getHandler(),
			context.getClass()
		]);

		if (!requiredRoles || requiredRoles.length === 0) {
			return true; // Không yêu cầu vai trò, cho phép truy cập
		}

		const request = context.switchToHttp().getRequest();
		const authHeader = request.headers.authorization.split(' ')[1]; // Đảm bảo rằng user đã được gán trong quá trình xác thực trước đó

		const user = await this.jwtService.verifyJwt(authHeader);

		if (!user || !user.role) {
			throw new ForbiddenException('Invalid user or role'); // Người dùng không hợp lệ hoặc không có vai trò
		}

		const userRole: Roles = user.role as Roles; // Chuyển đổi kiểu dữ liệu
		const hasRequiredRole = requiredRoles.includes(userRole);
		if (!hasRequiredRole) {
			throw new ForbiddenException('Permission denied'); // Người dùng không có vai trò yêu cầu
		}

		return true; // Cho phép truy cập
	}
}
