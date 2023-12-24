import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { UserEntity } from '../entities/user.entity';
import { IsNotEmpty, IsNumberString, IsString, MaxLength, Validate, IsEmail, IsPhoneNumber, IsEnum} from 'class-validator';
import { Gender } from 'src/common/enums/gerder.enum';
export class UpdateUserDto extends PartialType(UserEntity) {
   
    @IsString()
	@IsNotEmpty()
	@MaxLength(255)
	givenName?: string;

	@IsString()
	@IsNotEmpty()
	@MaxLength(255)
	familyName?: string;

	@IsNotEmpty()
    @IsEmail()
	email?: string;

    @IsString()
	@IsNotEmpty()
	phone?: string;

	@IsString()
	@IsNotEmpty()
	avatar?: string;

}
