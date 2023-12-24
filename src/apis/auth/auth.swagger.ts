import { applyDecorators } from '@nestjs/common';
import { ApiOperation, getSchemaPath } from '@nestjs/swagger';
import { OkResponse } from 'src/common/base/base.swagger';
import { AdminEntity } from '../admin/entities/admin.entity';
import { UserType } from './interfaces/auth.interface';
import { UserEntity } from '../user/entities/user.entity';

const getRef = (UserType) => {
	let $ref;

	switch (UserType) {
		case 'user':
			$ref = UserEntity;
			break;
	}

	return $ref;
};

const loginResponse = (UserType) => ({
	properties: {
		result: {
			type: 'array',
			items: {
				properties: {
					user: {
						$ref: getSchemaPath(getRef(UserType))
					},
					accessToken: { example: 'string' }
				}
			}
		}
	}
});

export function ApiRefreshToken(UserType) {
	return applyDecorators(
		ApiOperation({ summary: 'Refresh token for ' + UserType }),
		OkResponse(null, false, loginResponse(UserType))
	);
}

export function ApiLogin(UserType) {
	return applyDecorators(
		ApiOperation({ summary: 'Login for ' + UserType }),
		OkResponse(null, false, loginResponse(UserType))
	);
}

export function ApiChangePassword(UserType) {
	return applyDecorators(
		ApiOperation({ summary: 'Change password for ' + UserType }),
		OkResponse(getRef(UserType))
	);
}

export function ApiLogout(UserType) {
	return applyDecorators(
		ApiOperation({ summary: 'Logout for ' + UserType }),
		OkResponse(null, false, { example: { message: 'Logout successfully' } })
	);
}
