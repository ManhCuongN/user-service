import { Controller, Post, Body,Get, Res, Req, Patch, Param, UseGuards, HttpCode } from '@nestjs/common';
import { AddressService } from '../services/address.service';
import { CreateAddressDto } from '../dto/create-address.dto';
import { UpdateAddressDto } from '../dto/update-address.dto';
import { BaseController } from 'src/common/base/base.controller';
import { AddressEntity } from '../entities/address.entity';
import { ApiCreate, ApiUpdate } from 'src/common/base/base.swagger';
import { ApiTags } from '@nestjs/swagger';
import { JwtRequestGuard } from 'src/common/guards/jwt-request.guard';
import { User } from 'src/common/decorators/user.decorator';
import { AuthUser } from 'src/common/decorators/auth-user.decorator';
import { Roles } from 'src/common/enums/role.enum';

@Controller('address')
@ApiTags('Address API')
export class AddressController extends BaseController<AddressEntity>(AddressEntity, 'address') {
	relations = [];

	constructor(private readonly addressService: AddressService) {
		super(addressService);
		
	}

	@Post("/create")
	@HttpCode(200)
	@AuthUser(Roles.USER)
	@UseGuards(JwtRequestGuard)
	@ApiCreate(AddressEntity, 'address')
	createAddress(@Body() body: CreateAddressDto, @User() user) {
		body.user = user
		return this.addressService.createAddress(body);
	}
	@Post('/test')
		@HttpCode(200)
		@AuthUser(Roles.USER)
		@UseGuards(JwtRequestGuard)
		async test(@Res() res, @Req() req, @User() user) {
			console.log(user);

			res.send(req.user);
		}

	@Patch("/update/:id")
	@HttpCode(200)
	@UseGuards(JwtRequestGuard)
	@ApiUpdate(AddressEntity, 'address')
	updateAddress(@Param('id') id: string, @Body() body: UpdateAddressDto){
		return this.addressService.updateAddress(id,body)
	}

	@Get("follow/user") 
	@HttpCode(200)
	@UseGuards(JwtRequestGuard)
	@ApiUpdate(AddressEntity, 'addressUser')
	getAddressUser(@User() user ) {
		return this.addressService.getAddressUser(user.idUser);
	}

	

}
