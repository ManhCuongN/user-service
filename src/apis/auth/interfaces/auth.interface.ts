import { UserEntity } from 'src/apis/user/entities/user.entity';
import { AdminEntity } from '../../admin/entities/admin.entity';


export const UserType = 'user';


export type Admin = AdminEntity;
export type User = UserEntity;

