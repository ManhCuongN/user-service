import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { MetadataKey } from 'src/common/constant';
import { RedisService } from './redis.service';

@Global()
@Module({
	providers: [
		{
			provide: MetadataKey.REDIS,
			useFactory(config: ConfigService) {
			
				const redis = new Redis({
					port: config.get('REDIS_PORT'),
					host: config.get('REDIS_HOST'),
					password: config.get('REDIS_PASSWORD')
				});
				redis.on('connect', () => {
					console.log('Kết nối Redis đã được thiết lập thành công');
				  });
				
				  redis.on('error', (error) => {
					console.error('Lỗi kết nối Redis:', error);
				  });
				  return redis
			},
			inject: [ConfigService]
		},
		RedisService
	],
	exports: [RedisService]
})
export class RedisModule {}
