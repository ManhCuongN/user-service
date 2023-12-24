

export const MetadataKey = {
	REDIS: 'redis',
	ROLE: 'role'
};

export const StrategyKey = {
	LOCAL: {
		ADMIN: 'local_admin',
		USER: 'local_user',
		GOOGLE: 'google',
		
	},
	JWT: {
		ADMIN: 'jwt_admin',
		USER: 'jwt_user',
		GOOGLE: 'google'

	}
};

export const TokenExpires = {
	accessToken: '15d',
	refreshToken: '30d',
	redisAccessToken: 60 * 60 * 24 * 15,
	redisRefreshToken: 60 * 60 * 24 * 30
};
