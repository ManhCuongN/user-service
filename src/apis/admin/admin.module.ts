import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './controllers/admin.controller';
import { AdminEntity } from './entities/admin.entity';
import { AdminService } from './services/admin.service';
import { PassportModule } from '@nestjs/passport';

@Module({
	imports: [TypeOrmModule.forFeature([AdminEntity]), 	AdminModule],
	controllers: [AdminController],
	providers: [AdminService],
	exports: [AdminService]
})
export class AdminModule {}
