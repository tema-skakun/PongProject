import { Config } from "../interfaces/config"; 
import { GameState } from "../interfaces/gameState";


export function paddle(SCALAR: number, CONFIG: Config, drawingContext: CanvasRenderingContext2D, gameState: GameState, paddleNr: number) {

	drawingContext.fillStyle = CONFIG.PADDLE_COLOR;
	if (paddleNr === 1)
		drawingContext.fillRect(CONFIG.PADDING / SCALAR, gameState.paddleY / SCALAR, CONFIG.PADDLE_WIDTH / SCALAR, CONFIG.PADDLE_HEIGHT / SCALAR);
	else if (paddleNr === 2)
		drawingContext.fillRect(CONFIG.WIDTH / SCALAR - CONFIG.PADDING / SCALAR - CONFIG.PADDLE_WIDTH / SCALAR, gameState.paddleY2 / SCALAR, CONFIG.PADDLE_WIDTH / SCALAR, CONFIG.PADDLE_HEIGHT / SCALAR);
}
