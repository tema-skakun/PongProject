import { Config } from "../interfaces/config"; 
import { GameState } from "../interfaces/gameState";


export function dot(CONFIG: Config, drawingContext: CanvasRenderingContext2D, gameState: GameState) {

	drawingContext.fillStyle = CONFIG.DOT_COLOR;
	drawingContext.fillRect(gameState.dotCoordinate.x, gameState.dotCoordinate.y, CONFIG.DOT_WIDTH, CONFIG.DOT_HEIGHT);
}
