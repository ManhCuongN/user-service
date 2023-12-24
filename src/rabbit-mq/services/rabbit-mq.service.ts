// rabbitmq/rabbitmq.service.ts
import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService {
	runProducerFollowShop = async(messages) => {
		try {
			const connection = await amqp.connect('amqps://ejaqrslc:FdbEYeWt40a6ggQ8zhoALDTREg1wcFUf@gerbil.rmq.cloudamqp.com/ejaqrslc')
	
			const channel = await connection.createChannel()
	
			const queueName = 'follow-shop-topic'
			await channel.assertQueue(queueName, {
				durable: true
			})
	
			channel.sendToQueue(queueName, Buffer.from(JSON.stringify(messages)))
			setTimeout(() => {
				connection.close()
				// process.exit(0)
			}, 500)
			console.log(`messages sent`, messages);
		} catch (error) {
			console.log(console.error(error));
		}
	}
	
	runProducerUnFollowShop = async(messages) => {
		try {
			const connection = await amqp.connect('amqps://ejaqrslc:FdbEYeWt40a6ggQ8zhoALDTREg1wcFUf@gerbil.rmq.cloudamqp.com/ejaqrslc')
	
			const channel = await connection.createChannel()
	
			const queueName = 'un-follow-shop-topic'
			await channel.assertQueue(queueName, {
				durable: true
			})
	
			channel.sendToQueue(queueName, Buffer.from(JSON.stringify(messages)))
			
			setTimeout(() => {
				connection.close()
				// process.exit(0)
			}, 500)
			console.log(`messages sent`, messages);
		} catch (error) {
			console.log(console.error(error));
		}
	}

	runProducerGetNotiByUser = async(messages) => {
		try {
			const connection = await amqp.connect('amqps://ejaqrslc:FdbEYeWt40a6ggQ8zhoALDTREg1wcFUf@gerbil.rmq.cloudamqp.com/ejaqrslc')
	
			const channel = await connection.createChannel()
	
			const queueName = 'get-noti-by-user-topic'
			await channel.assertQueue(queueName, {
				durable: true
			})
	
			channel.sendToQueue(queueName, Buffer.from(JSON.stringify(messages)))
			
			setTimeout(() => {
				connection.close()
				// process.exit(0)
			}, 500)
			console.log(`messages sent`, messages);
		} catch (error) {
			console.log(console.error(error));
		}
	}
  
}
