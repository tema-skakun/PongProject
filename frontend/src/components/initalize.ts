import { Config } from "../interfaces/config"; 

export function clear(CONFIG: Config, drawingContext: CanvasRenderingContext2D) {

	drawingContext.fillStyle = CONFIG.BACKGROUND_COLOR;
	drawingContext.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);
}