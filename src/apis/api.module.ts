import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { UserModule } from './user/user.module';
import { UploadModule } from './upload/upload.module';
import { APP_GUARD } from '@nestjs/core';
import { RoleGuard } from 'src/common/guards/role.guard';
import { PassportModule as NestPassportModule } from '@nestjs/passport';
import { GoogleStrategy } from 'src/passport/strategies/jwt/google.jwt.strategy';
// import { KafkaModule } from './kafka/kafka.module';
import { AddressModule } from './address/address.module';
import { CommentModule } from './comment/comment.module';
import { RabbitMqModule } from 'src/rabbit-mq/rabbit-mq.module';

@Module({
	imports: [AdminModule, AuthModule, UploadModule, ChatModule, UserModule, AddressModule, CommentModule, RabbitMqModule],
	providers: []
})
export class ApiModule {}
