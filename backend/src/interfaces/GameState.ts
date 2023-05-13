import { Key } from "src/constants/constants";
export interface GameState {
	dotCoordinate : {
		x: number;
		y: number;
	};
	paddleY: number;
	paddleY2: number;

	id?: string;
	velocity?: math.Matrix;

	player1: Key;
	player2: Key;

	goalsPlayer1: number;
	goalsPlayer2: number;
}
