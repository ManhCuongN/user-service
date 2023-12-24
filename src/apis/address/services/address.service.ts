import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base/base.service';
import { DeepPartial, Repository } from 'typeorm';
import { AddressEntity } from '../entities/address.entity';
import { UserEntity } from 'src/apis/user/entities/user.entity';

@Injectable()
export class AddressService extends BaseService<AddressEntity> {
	name = 'Address';

	constructor(
		@InjectRepository(AddressEntity)
		private readonly addressRepo: Repository<AddressEntity>
	) {
		super(addressRepo);
	}

	async createAddress(data) {
		try {
			const newAddress = this.addressRepo.create(data);
			return this.addressRepo.save(newAddress);
		} catch (error) {
			throw error;
		}
	}

	async getAddressUser(userId) {
		try {
			const addresses = await this.addressRepo
				.createQueryBuilder('address')
				.where('address.user.idUser = :userId', { userId }) // Lọc các địa chỉ dựa trên userId
				.getMany();

			// Trả về danh sách các địa chỉ của người dùng
			return addresses;
		} catch (error) {
			throw error;
		}
	}

	async updateAddress(idAddress: string, data) {
		const existingAddress = await this.addressRepo.findOne({ where: { idAddress } });

		if (!existingAddress) {
			throw new BadRequestException('Địa chỉ không tồn tại');
		}

		// Cập nhật các thuộc tính của đối tượng hiện có với dữ liệu mới từ body
		Object.assign(existingAddress, data);

		// Lưu thay đổi và trả về đối tượng đã cập nhật thành công
		return this.addressRepo.save(existingAddress);
	}
}
