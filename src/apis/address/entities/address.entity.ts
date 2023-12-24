import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from 'src/common/base/base.entity';
import { UserEntity } from 'src/apis/user/entities/user.entity';

@Entity({ name: 'address' })
export class AddressEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    idAddress!: string

    @Column()
    district!: string

    @Column()
    wards!: string

    @Column()
    city?:string

    @Column()
    phone?:string

    @Column()  
    recipientName!: string

    @Column()  
    email?: string

    @Column({nullable: true})
    note?: string

    @ManyToOne(() => UserEntity, user => user.addresses)
    user!: UserEntity;
}
