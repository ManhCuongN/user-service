import { Inject, Injectable } from '@nestjs/common';
// import { CreateOrderRequest } from './create-request.dto';
import { ClientKafka } from '@nestjs/microservices';
// import { OrderCreatedEvent } from './order-created.event';

@Injectable()
export class AppService {
   
	getHello(): string {
		return 'Hello World!';
	}

	// createOrder(create: CreateOrderRequest) {
	// 	this.billingClient.emit(
	// 	  'order_created',
	// 	  new OrderCreatedEvent('123', 'create'),
	// 	);
	//   }
}
