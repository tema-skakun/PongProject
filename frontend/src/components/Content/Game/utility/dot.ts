import { Config } from "../interfaces/config"; 
import { GameState } from "../interfaces/gameState";


export function dot(SCALAR: number, CONFIG: Config, drawingContext: CanvasRenderingContext2D, gameState: GameState) {

	drawingContext.fillStyle = CONFIG.DOT_COLOR;
	drawingContext.fillRect(gameState.dotCoordinate.x / SCALAR, gameState.dotCoordinate.y / SCALAR, CONFIG.DOT_WIDTH / SCALAR, CONFIG.DOT_HEIGHT / SCALAR);
}
