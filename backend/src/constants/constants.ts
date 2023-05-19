import * as math from "mathjs";

export enum Key {
	NoKey,
	ArrowUp,
	ArrowDown
}

const HEIGHT: number = 600;
const WIDTH: number = HEIGHT * (1 + 1/2);

const DOT_WIDTH: number = 50;
const DOT_HEIGHT: number = 50;
const PADDLE_HEIGHT: number = HEIGHT / 8;
const PADDLE_WIDTH: number = WIDTH / 60;

export interface Velocity {
	x: number;
	y: number;
}

export const randomVelocity: () => math.Matrix = () => math.matrix([
	[(math.random(0, 1) < 0.5) ? -WIDTH / (5 + 1/3) / 60: WIDTH / (5 + 1/3) / 60],
	[0]
]);

export interface ConfigInter {
	PING_TRESHOLD: number;
	POINTS: number;
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

export default {
	PING_TRESHOLD: 200,
	POINTS: 3,
	MAX_VEL: WIDTH / (2 + 2/3) / 60,
	BACKGROUND_COLOR: 'red',
	SPAWN_EXCLUSION: HEIGHT / 4,
	UPDATE_INTERVAL: 1000 / 60,
	DEGREES: 45,
	WIDTH: WIDTH,
	HEIGHT: HEIGHT,
	DOT_WIDTH: WIDTH / 60,
	DOT_HEIGHT: WIDTH / 60,
	DOT_COLOR: "white",
	PADDLE_HEIGHT: PADDLE_HEIGHT,
	PADDLE_WIDTH: PADDLE_WIDTH,
	PADDLE_COLOR: "violet",
	PADDING: PADDLE_WIDTH,
	PADDLE_SPEED: WIDTH / (5 + 1/3), // In width units per second!
	BUMPS_TILL_MAX_SPEED: 12,
	initialState: {
	  dotCoordinate: {
		x: WIDTH / 2 - (DOT_WIDTH / 2),
		y: undefined, // moking value: HEIGHT / 2 - (DOT_HEIGHT / 2)
	  },
	  paddleY: HEIGHT / 2 - (PADDLE_HEIGHT / 2), // lower bound coordniates
	  paddleY2: HEIGHT / 2 - (PADDLE_HEIGHT / 2),

	  player1: Key.NoKey,
	  player2: Key.NoKey,

	  goalsPlayer1: 0,
	  goalsPlayer2: 0
	},
  };