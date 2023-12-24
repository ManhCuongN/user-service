import { Module } from '@nestjs/common';
import { RabbitMQService } from './services/rabbit-mq.service';



@Module({
	providers: [RabbitMQService],
	exports: [RabbitMQService]
})
export class RabbitMqModule {}
