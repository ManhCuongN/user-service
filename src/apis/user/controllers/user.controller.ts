import {
	Controller,
	Post,
	Body,
	Patch,
	Param,
	HttpCode,
	UseGuards,
	Res,
	Get,
	Req,
	Put,
	Delete,
	BadRequestException
} from '@nestjs/common';

import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { BaseController } from 'src/common/base/base.controller';
import { UserEntity } from '../entities/user.entity';
import { ApiCreate, ApiUpdate, ApiGetDetail } from 'src/common/base/base.swagger';
import { ApiTags } from '@nestjs/swagger';
import { ApiLogin } from 'src/apis/auth/auth.swagger';
import { AuthGuard } from '@nestjs/passport';
import { AdminStrategy } from 'src/passport/strategies/local/admin.local.strategy';
import { JwtRequestGuard } from 'src/common/guards/jwt-request.guard';
import { LoginDto } from 'src/apis/auth/dtos/login.dto';
import { UserType } from 'src/apis/auth/interfaces/auth.interface';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { User } from 'src/common/decorators/user.decorator';
import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter';
import { UseFilters } from '@nestjs/common';
import axios from 'axios';
@Controller('user')
@ApiTags('User API')
export class UserController extends BaseController<UserEntity>(UserEntity, 'user') {
	relations = [];

	constructor(private readonly userService: UserService) {
		super(userService);
	}

	@Get('/information')
	@HttpCode(200)
	@UseGuards(JwtRequestGuard)
	async getInforUser(@Res() res, @User() user) {
		try {
			res.json({ status: true, user: user });
		} catch (error) {
			throw error;
		}
	}

	@Delete('/delete')
	@HttpCode(200)
	async deleteUser(@Req() req, @Res() res) {
		const {idUser} = req.body
		try {
			await this.userService.deleteUser(idUser)
		} catch (error) {
			throw error;
		}
	}

	@Get('/test/server')
	@HttpCode(200)
	async testServer(@Req() req, @Res() res) {
		try {
			res.json({ mess: "Hello Server 1" });
		} catch (error) {
			throw error;
		}
	}

	@Post('/follow/shop/:shopId')
	@HttpCode(200)
	@UseGuards(JwtRequestGuard)
	async followShop(@Req() req, @User() user) {
		const { shopId } = req.params;
		try {
			// console.log("hú", {shopId, user});
			
			await this.userService.followShop(shopId, user);
		} catch (error) {
			throw error;
		}
	}

	@Post('/unfollow/shop/:shopId')
	@HttpCode(200)
	@UseGuards(JwtRequestGuard)
	async unFollowShop(@Req() req, @User() user) {
		const { shopId } = req.params;
		try {
			const result = await this.userService.unFollowShop(shopId, user);
			return result;
		} catch (error) {
			throw error;
		}
	}

	@Post('/check/exist')
	async checkUserExist(@Res() res, @Req() req) {
		const userId = req.body.userId;
		try {
			const user = await this.userService.findByIdUserV2(userId);
			res.json({ user });
		} catch (error) {
			throw error;
		}
	}

	@Post('/register/account')
	@ApiCreate(UserEntity, 'user')
	createAccount(@Body() body: CreateUserDto) {
		return this.userService.registerAccount(body);
	}

	@Patch('/update/:id')
	@HttpCode(200)
	@ApiUpdate(UserEntity, 'user')
	update(@Param('id') id: string, @Body() body: Partial<UpdateUserDto>) {
		return this.userService.updateUser(id, body);
	}

	@Put()
	@HttpCode(200)
	@UseGuards(JwtRequestGuard)
	changePassword(@Body() body: ChangePasswordDto, @User() user: UserEntity) {
		return this.userService.changePassword(body, user);
	}

	@Patch('/forgot-pass')
	@HttpCode(200)	
	forgotPassword(@Body() body) {
		return this.userService.forgotPassword(body);
	}

	@Post('/login')
	@HttpCode(200)
	async login(@Body() body: LoginDto, @Res() res) {
		try {
			const result = await this.userService.login(body);
			res.json({
				accessToken: result?.accessToken,
				refreshToken: result?.refreshToken,
				userId: result?.idUser
			});
		} catch (error) {
			throw error;
		}
	}

	@Get('/get/all')
	@HttpCode(200)
	async getAllUsers(@Res() res) {
		try {
			const result = await this.userService.getAllUsers();
			res.json({metadata: result});
		} catch (error) {
			throw error;
		}
	}

	@Post('/like/product')
	async likeProductByUsers(@Res() res, @Req() req) {
		const { productId, userId } = req.body;
		try {
			const result = await this.userService.likeProductByUsers(productId, userId);
			res.json(result);
		} catch (error) {
			throw error;
		}
	}

	@Get('/like/check/product')
	async checkUserLikedProduct(@Res() res, @Req() req) {
		const { productId, userId } = req.query;
		try {
			const result = await this.userService.checkUserLikedProduct(productId, userId);
			res.json({ isLiked: result });
		} catch (error) {
			throw error;
		}
	}

	@Get('/list/noti/:userId')
	async getNotiByUser(@Res() res, @Req() req) {
		const { userId } = req.params;
		try {
			const result = await this.userService.getNotiByUser(userId);
			res.json({ isLiked: result });
		} catch (error) {
			throw error;
		}
	}

	// // order of user
	@Post('/list/order')
	async getListOrder(@Res() res, @Req() req) {
		const apiUrl = 'https://system-service-production.up.railway.app/api/s3/get-list-order';
		

		try {
			const response = await axios.post(apiUrl, req.body);
			const data = response.data;
			res.json(data);
		} catch (error) {
			console.error('Error calling API:', error);
		}
	}

	@Post('/list/order-by-shop')
	async getListOrderByShop(@Res() res, @Req() req) {
		
		const apiUrl = 'https://system-service-production.up.railway.app/api/s3/get-list-order-by-shop';

		try {
			const response = await axios.post(apiUrl, req.body);
			const data = response.data;
			res.json(data);
		} catch (error) {
			console.error('Error calling API:', error);
		}
	}
}
