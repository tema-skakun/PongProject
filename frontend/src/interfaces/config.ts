export interface Config {
	BACKGROUND_COLOR: string;
	SPAWN_EXCLUSION: number;
	UPDATE_INTERVAL: number;
	DEGREES: number;
	WIDTH: number;
	HEIGHT: number;
	DOT_WIDTH: number;
	DOT_HEIGHT: number;
	DOT_COLOR: string;
	PADDLE_HEIGHT: number;
	PADDLE_WIDTH: number;
	PADDLE_COLOR: string;
	PADDING: number;
	initialState: {
	dotCoordinate: {
		x: number;
		y: number;
	};
	paddleY: number;
	paddleY2: number;
	}

}
