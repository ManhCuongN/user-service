import { IsNotEmpty, IsNumberString, IsString, MaxLength, Validate, IsEmail, IsPhoneNumber, IsEnum, IsOptional, IsEmpty } from 'class-validator';
import { Gender } from 'src/common/enums/gerder.enum';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  givenName!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  familyName!: string;

  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  
  @IsOptional()
  @IsEmpty()
  email?: string;

  @IsString()
  @IsNotEmpty()
  phone!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}
