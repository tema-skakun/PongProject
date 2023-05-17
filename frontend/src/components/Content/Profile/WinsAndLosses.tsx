
export const WinsAndLosses: React.FC<any> = ({user}) => {
	return <span>
		wins: {user.total_wins}/ losses: {user.total_losses}
	</span>
} 