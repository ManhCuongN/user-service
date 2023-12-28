import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import * as argon2 from 'argon2';
import { Strategy } from 'passport-google-oauth20';
import { AdminService } from 'src/apis/admin/services/admin.service';
import { AuthService } from 'src/apis/auth/services/auth.service';
import { UserEntity } from 'src/apis/user/entities/user.entity';
import { UserService } from 'src/apis/user/services/user.service';
import { StrategyKey } from 'src/common/constant';
import { Gender } from 'src/common/enums/gerder.enum';
import { Roles } from 'src/common/enums/role.enum';
import { Level } from 'src/common/enums/level.enum';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
	
	
	constructor(private readonly userService: UserService) {
		console.log('GoogleStrategy constructor được gọi'); // Thêm dòng này
		super({
			clientID: '271992843565-j9atm60nuls2mbbhtlj0a8eb7mkh4g7r.apps.googleusercontent.com',
			clientSecret: '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',
			callbackURL: 'https://api-gateway-production-187c.up.railway.app/api/v1/auth/user/auth/google/callback',
			scope: ['profile', 'email']
		});
	}

	async validate(
		accessToken: string,
		refreshToken: string,
		profile: any,
		done: (error: any, user?: any, info?: any) => void
	) {		
		
		//console.log('Phương thức validate của GoogleStrategy được gọi',profile); 
		try {
			let user = await this.userService.findUserByGoogleId(profile.id);
			if (!user) {
				const extension = profile._json.email.split('@')[1];
				const tdtu =
					extension.match('tdt') || extension.match('gmail') || extension.match('vku');
				if (tdtu == null) {
					throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
				}
				user = new UserEntity();
				user.googleId = profile.id;
				user.familyName = profile.name.familyName;
				user.givenName = profile.name.givenName;
				user.email = profile._json.email;
				user.avatar = profile._json.picture;
				user.role = Roles.USER;
				user.level = Level.BRONZE;
				await this.userService.createNewUser(user);
			}
			 
			

			done(null, { user });
		} catch (err) {
			done(err, null);
		}
	}
}
