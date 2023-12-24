import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { RabbitMqModule } from 'src/rabbit-mq/rabbit-mq.module';

@Module({
	imports: [TypeOrmModule.forFeature([UserEntity]), RabbitMqModule],
	controllers: [UserController],
	providers: [UserService],
	exports: [UserService]
})
export class UserModule {}
