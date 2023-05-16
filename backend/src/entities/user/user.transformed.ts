import { Exclude, Expose } from "class-transformer";


// Query without relationships
export class UserTransformed {
	@Expose()
	intra_id: number;

	@Expose()
	username: string;

	@Expose()
	picture_url: string;

	@Expose()
	total_wins: number;

	@Expose()
	total_losses: number;

	@Expose()
	isTwoFactorAuthenticationEnabled: boolean;

	// Rest excluded!

	@Exclude()
	created_at: Date;

	@Exclude()
	updated_at: Date;

	@Exclude()
	email: string;

	@Exclude()
	first_name: string;

	@Exclude()
	last_name: string;

	@Exclude()
	accessToken?: string;

	@Exclude()
	refreshToken?: string;

	@Exclude()
	twoFactorAuthenticationSecret?: string;

}
