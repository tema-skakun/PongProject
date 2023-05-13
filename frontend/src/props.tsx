export interface blockProps {
	setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
	// setis2f: React.Dispatch<React.SetStateAction<boolean>>;
	userdata: userProps | undefined;
}


export interface userProps {
	username: string,
	email: string,
	full_name: string,
	picture_url: string,
	isTwoFactorAuthenticationEnabled: boolean,
}

export interface twofprops extends blockProps {
	setis2f: React.Dispatch<React.SetStateAction<boolean>>;
	is2f: boolean;
}
