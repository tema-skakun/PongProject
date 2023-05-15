
export const WinsAndLosses: React.FC<any> = ({user}) => {
	return <span>
		wins: {user.total_wins}/ losses: {user.total_losses}: {(Number(user.total_wins) / Number(user.total_losses)).toFixed(2)}
	</span>
} 