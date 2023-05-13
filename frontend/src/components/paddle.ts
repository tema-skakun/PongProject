import { Config } from "../interfaces/config"; 
import { GameState } from "../hooks/useSocket";


export function paddle(CONFIG: Config, drawingContext: CanvasRenderingContext2D, gameState: GameState, paddleNr: number) {

	drawingContext.fillStyle = CONFIG.PADDLE_COLOR;
	if (paddleNr === 1)
		drawingContext.fillRect(CONFIG.PADDING, gameState.paddleY, CONFIG.PADDLE_WIDTH, CONFIG.PADDLE_HEIGHT);
	else if (paddleNr === 2)
		drawingContext.fillRect(CONFIG.WIDTH - CONFIG.PADDING - CONFIG.PADDLE_WIDTH, gameState.paddleY2, CONFIG.PADDLE_WIDTH, CONFIG.PADDLE_HEIGHT);
}
