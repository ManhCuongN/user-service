import { Module } from '@nestjs/common';
import { AddressService } from './services/address.service';
import { AddressController } from './controllers/address.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressEntity } from './entities/address.entity';
import { UserModule } from '../user/user.module';
import { AdminStrategy } from 'src/passport/strategies/local/admin.local.strategy';
import { GoogleStrategy } from 'src/passport/strategies/jwt/google.jwt.strategy';

@Module({
	imports: [TypeOrmModule.forFeature([AddressEntity]), UserModule],
	controllers: [AddressController],
	providers: [AddressService, AdminStrategy,GoogleStrategy],
	exports: [AddressService]
})
export class AddressModule {}
