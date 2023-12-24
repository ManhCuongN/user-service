import { BaseEntity } from 'src/common/base/base.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'room' })
export class RoomEntity extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column()
	name!: string;

	@Column({ type: 'simple-array' })
	members!: string[];
}
