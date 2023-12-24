import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class LoginDto {

	@IsNotEmpty()
	phoneOrEmail!: string;

	@IsString()
	@IsNotEmpty()
	password!: string;
}
