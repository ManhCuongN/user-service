import { IsEmpty, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateAddressDto {
    
    user!: string

    @IsString()
    @MaxLength(255)
    @IsNotEmpty()
    district!:string

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    wards!:string

    @IsString()
    @MaxLength(150)
    @IsNotEmpty()
    city!: string

    @IsString()
    @MaxLength(150)
    @IsNotEmpty()
    recipientName!: string

    @IsString()
    @IsNotEmpty()
    phone!:string

    @IsString()
    @IsOptional()
    @MaxLength(255)
    note?:string
}
