import { Exclude, Expose } from "class-transformer";


// Query without relationships
export class UserTransformed {
	@Expose()
	intra_id: number;

	@Expose()
	username: string;

	@Expose()
	picture_url: string;

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

	@Exclude()
	isTwoFactorAuthenticationEnabled: boolean;

	@Exclude()
	total_wins: number;

	@Exclude()
	total_losses: number;
}
