import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from 'src/jwt/jwt.service';

export const User = createParamDecorator(async(data: unknown, ctx: ExecutionContext) => {
	const request = ctx.switchToHttp().getRequest<Request>();
	return request.user;
});
