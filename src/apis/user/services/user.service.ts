import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base/base.service';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import * as argon2 from 'argon2';
import { JwtService } from 'src/jwt/jwt.service';
import { RabbitMQService } from 'src/rabbit-mq/services/rabbit-mq.service';
import { RedisService } from 'src/redis/redis.service';
import { JwtPayload } from 'src/jwt/jwt.interface';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { User } from 'src/apis/auth/interfaces/auth.interface';


// import { ConsulDiscoveryService } from 'nestjs-consul-discovery';

@Injectable()
export class UserService extends BaseService<UserEntity> {
	name = 'User';
	constructor(
		@InjectRepository(UserEntity)
		private readonly userRepo: Repository<UserEntity>,
		private readonly jwtService: JwtService,
		private readonly redisService: RedisService,
		private readonly rabbitmqService: RabbitMQService
		
	) {
		super(userRepo);
	}

	async registerAccount(body) {
		const { phone, email } = body;

		try {
			let phoneUser, emailUser;

			if (phone) {
				phoneUser = await this.userRepo.findOne({ where: { phone } });
			}

			if (email) {
				emailUser = await this.userRepo.findOne({ where: { email } });
			}

			if (phoneUser || emailUser) {
				console.log('Đã tồn tại');
				throw new BadRequestException('Account is exist');
			} else {
				const user = this.userRepo.create(body);
				const newUser = await this.userRepo.save(user);

				const phoneUse2 = await this.userRepo.findOne({ where: { phone } });
				if (phoneUse2 != null) {
					const payload: JwtPayload = {
						id: phoneUse2.idUser,
						role: phoneUse2.role
					};
					const accessToken = await this.jwtService.signJwt(payload);
					const refreshToken = await this.jwtService.signJwt(payload, true);
					await this.redisService.setAccessToken(phoneUse2.idUser, accessToken);
					await this.redisService.setRefreshToken(phoneUse2.idUser, refreshToken);

					return { accessToken, refreshToken };
				}
			}
		} catch (error) {
			throw error;
		}
	}

	async updateUser(idUser, body): Promise<UserEntity> {
		try {
			let user = await this.findByIdUser(idUser);
			if (!user) {
				throw new NotFoundException('User not exist');
			}
			Object.assign(user, body); // Gán các giá trị từ body vào user
			return this.userRepo.save(user);
		} catch (error) {
			throw new Error('LOoix');
		}
	}

	async forgotPassword(body) {
		const {phoneOrEmail, password} = body
		
	
  try {
    const user = await this.userRepo.findOne({
      where: [{ email: phoneOrEmail }, { phone: phoneOrEmail }],
    });

    if (!user) {
      throw new BadRequestException('Không Tìm Thấy Tài Khoản');
    }

    // Hash mật khẩu mới
    const newPassword = await argon2.hash(password);

    // Gán mật khẩu mới vào đối tượng user
    user.password = newPassword;

    // Lưu đối tượng user đã được cập nhật vào cơ sở dữ liệu
    return this.userRepo.save(user);
  } catch (error) {
    console.log(error);
    throw new BadRequestException(error);
  }
	}

	async deleteUser(idUser) {
		console.log(idUser);
		
		try {
			// Tìm người dùng dựa trên idUser
			const user = await this.userRepo.findOneOrFail({
				where: { idUser: idUser },
			  });;
	  
			if (user) {
			  // Xóa người dùng nếu tồn tại
			  await this.userRepo.remove(user);
			} else {
			  throw new Error('User not found');
			}
		  } catch (error) {
			console.log(error);
			
			// throw new Error('Failed to delete user');
		  }
		
	}


	async getAllUsers() {
		try {
			let user = await this.userRepo.find();
			return user
		} catch (error) {
			throw new Error('LOoix');
		}
	}

	async changePassword(body: ChangePasswordDto, user: User) {
		try {
			const { newPassword, oldPassword } = body;
			const comparePassword = await argon2.verify(user.password, oldPassword);
			if (!comparePassword) {
				throw new BadRequestException({ oldPassword: 'Invalid old password' });
			}
			const hashedPassword = await argon2.hash(newPassword);
			return this.userRepo.update(user.idUser, { password: hashedPassword });
		} catch (error) {}
	}

	async findUserByGoogleId(googleId: string) {
		try {
			const user = await this.userRepo.findOneBy({ googleId });
			return user;
		} catch (error) {}
	}

	async findByIdUser(idUser: string): Promise<UserEntity> {
		try {
			const user = await this.userRepo.findOne({ where: { idUser } });

			if (!user) {
				throw new BadRequestException('User not found');
			}
			return user;
		} catch (error:any) {
			throw new BadRequestException(error.message);

		}
	}

	async findByIdUserV2(idUser: string) {
		
		try {
			const user = await this.userRepo.findOne({ where: { idUser } });
			if (!user) {
				throw new BadRequestException('User not found');
			}
			return user
		} catch (error:any) {
			throw new BadRequestException(error.message);

		}
	}
	async login(body) {
		console.log(body);

		const { phoneOrEmail, password } = body;
		try {
			const user = await this.userRepo.findOne({
				where: [{ email: phoneOrEmail }, { phone: phoneOrEmail }]
			});

			if (!user) {
				throw new BadRequestException('User information is incorrect');
			}

			const isPasswordValid = await argon2.verify(user.password, password);
			if (!isPasswordValid) {
				throw new BadRequestException('Password information is incorrect');
			}

			const payload: JwtPayload = {
				id: user.idUser,
				role: user.role
			};

			const accessToken = await this.jwtService.signJwt(payload);
			const refreshToken = await this.jwtService.signJwt(payload, true);
			await this.redisService.setAccessToken(payload.id, accessToken);
			await this.redisService.setRefreshToken(payload.id, refreshToken);
			return { accessToken, refreshToken, idUser: payload.id };
		} catch (error) {
			throw error; // R
		}
	}

	async createNewUser(user: UserEntity) {
		try {
			const newUser = await this.userRepo.save(user);
			return newUser;
		} catch (error) {}
	}

	async followShop(shopId, user) {
		try {

			const findUser = await this.userRepo.findOneOrFail({
				where: { idUser: user.idUser },
			  });
            
			
			if (!findUser.following) {
				findUser.following = [];
			}
		
			if (!findUser.following.includes(shopId)) {
				
				findUser.following.push(shopId);
			    await this.userRepo.save(findUser);
			}
			const message = {
				shopId,
				userId: user.idUser
			}
			 await this.rabbitmqService.runProducerFollowShop(message)
			
			
		} catch (error) {
			console.log("err", error);
			
			throw new BadRequestException('Follow Shop No Success');
		}
	}

	async unFollowShop(shopId, user) {
		try {

			const findUser = await this.userRepo.findOneOrFail({
				where: { idUser: user.idUser },
			  });
		  
			  // Kiểm tra xem có mảng following không
			  if (findUser.following) {
				// Lọc mảng để giữ lại các phần tử khác với shopId
				findUser.following = findUser.following.filter(id => id !== shopId);
		  
				// Cập nhật bản ghi người dùng trong cơ sở dữ liệu
				await this.userRepo.save(findUser);
			  }
		  
			const message = {
				shopId,
				userId: user.idUser
			}
			 await this.rabbitmqService.runProducerUnFollowShop(message)
			
		} catch (error) {
			console.log("err unfollow", error);
			
			throw new BadRequestException('Follow Shop No Success');
		}
	}

	async getNotiByUser(userId) {
		try {
			const message = {	
				userId
			}
			 await this.rabbitmqService.runProducerGetNotiByUser(message)
			
			
		} catch (error) {
			throw new BadRequestException('Bad');
		}
	}

	async likeProductByUsers(productId, userId) {
		try {
		  const result = await this.redisService.setUserIdLikeProduct(productId, userId);
		  return result;
		} catch (error) {
		  throw error;
		}
	  }

	  async checkUserLikedProduct(productId, userId) {
		try {
		  const result = await this.redisService.checkSISMEMBER(productId, userId);
		  return result;
		} catch (error) {
		  throw error;
		}
	  }

	// async  getListOrder(order_userId, order_status) {
    //    try {
	// 	 const result = await this.
	//    } catch (error) {
	// 	   throw new BadRequestException('Get List Order Failed');
	//    }
	// }
}
