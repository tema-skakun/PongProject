import { IsEmail, IsNotEmpty, IsNumber, IsString, MinLength } from "class-validator"

export class UserDto {
	@IsNumber()
	@IsNotEmpty()
	intra_id: number

	@IsNotEmpty()
	@MinLength(3)
	username: string

	@IsEmail()
	@IsNotEmpty()
	email: string

	@IsString()
	first_name?: string

	@IsString()
	last_name?: string

	@IsString()
	picture_url?: string

	@IsString()
	accessToken?: string

	@IsString()
	refreshToken?: string

}
