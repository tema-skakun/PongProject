export interface GameState {
	dotCoordinate: {
		x: number;
		y: number;
	};
	paddleY: number;
	paddleY2: number;

	goalsPlayer1: number;
	goalsPlayer2: number;
}
