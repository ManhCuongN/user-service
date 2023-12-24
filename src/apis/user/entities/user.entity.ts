import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from 'src/common/base/base.entity';
import { Exclude } from 'class-transformer';
import { ApiHideProperty } from '@nestjs/swagger';
import { Gender } from 'src/common/enums/gerder.enum';
import { Roles } from 'src/common/enums/role.enum';
import { v4 as uuidv4 } from 'uuid';
import * as argon2 from 'argon2';
import { IsEmail, IsEnum, IsPhoneNumber, IsString, MaxLength } from 'class-validator';
import { Level } from 'src/common/enums/level.enum';
import { AddressEntity } from 'src/apis/address/entities/address.entity';
@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
	@PrimaryGeneratedColumn()
	idUser!: string;

	@Column({ nullable: true })
	googleId?: string;

	@Column()
	@IsString()
	@MaxLength(255)
	givenName?: string;

	@Column()
	@IsString()
	@MaxLength(255)
	familyName?: string;

	@Column({ type: 'simple-array', nullable: true })
    following?: string[];

	@Column({
		type: 'enum',
		enum: Gender,
		default: Gender.MALE,
		nullable: true
	})
	@IsEnum(Gender)
	gender?: Gender;

	@Column({ nullable: true })
	@IsEmail()
	email?: string;

	@Column({ nullable: true })
	@IsPhoneNumber()
	phone?: string;

	@Column({ nullable: true })
	avatar?: string;

	@Column({
		type: 'enum',
		enum: Level,
		default: Level.BRONZE,
		nullable: true
	})
	level!: string;

	@Column({
		type: 'enum',
		enum: Roles,
		default: Roles.USER,
		nullable: true
	})
	@IsEnum(Roles)
	role!: Roles;

	 @OneToMany(() => AddressEntity, address => address.user, { cascade: true, nullable: true })
     addresses?: AddressEntity[];

	@Column({ nullable: true })
	password!: string;

	@BeforeInsert()
	async beforeInsert() {
		const tempPassword = this.password;
		if (tempPassword) {
			this.password = await argon2.hash(tempPassword);
		}
	}
}
