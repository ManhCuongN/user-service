import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from 'src/jwt/jwt.service';
import { UserService } from 'src/apis/user/services/user.service';

@Injectable()
export class JwtRequestGuard implements CanActivate {
	constructor(
		private readonly jwtService: JwtService,
		private readonly userService: UserService
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest<Request>();
		
		
		const token = this.extractTokenFromHeader(request);
		if (!token) {
			throw new UnauthorizedException();
		}
		try {
			const payload = await this.jwtService.verifyJwt(token);
			const user = await this.userService.findByIdUser(payload.id);
			

			// Gán user vào request để sử dụng trong route handlers
			request['user'] = user;
			
		} catch {
			throw new UnauthorizedException();
		}
		return true;
	}

	private extractTokenFromHeader(request: Request): string | undefined {
		const [type, token] = request.headers.authorization?.split(' ') ?? [];
		return type === 'Bearer' ? token : undefined;
	}
}
