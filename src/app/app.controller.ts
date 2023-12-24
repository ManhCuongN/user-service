import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiExcludeController, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';


@Controller()
@ApiTags('App')
@ApiExcludeController()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	getHello(): string {
		return this.appService.getHello();
	}

	// @Post()
	// createOrder(@Body() createOrderRequest: CreateOrderRequest) {
	// 	this.appService.createOrder(createOrderRequest)
	// }
	
}
