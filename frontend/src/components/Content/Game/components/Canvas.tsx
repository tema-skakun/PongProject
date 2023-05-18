import { useRef, useState, useEffect } from "react";
import { winningStates } from "../Game";
import { Config } from "../interfaces/config";
import { GameState } from "../interfaces/gameState";
import { useCanvas } from "../hooks/useCanvas";
import { useAnimation } from "../hooks/useAnimation";
import { useCallback } from "react";
import { Numbers } from "../utility/number";
import { dot } from "../utility/dot";
import { paddle } from "../utility/paddle";
import { clear } from "../utility/initalize";

export type CanvasProps = {
	gameStateRef: React.MutableRefObject<GameState | null>;
	CONFIG: Config | null;
	winningRef: React.MutableRefObject<winningStates>;
	backgroundImg: React.MutableRefObject<HTMLImageElement>;
}

export const Canvas: React.FC<CanvasProps> = ({gameStateRef, CONFIG, winningRef, backgroundImg}: CanvasProps) => {

	const CanvasRef: React.RefObject<HTMLCanvasElement> = useRef<HTMLCanvasElement>(null);
	const [drawingContext, setDrawingContext] = useState<CanvasRenderingContext2D | null>(null)
	const [SCALAR, setSCALAR] = useState<number>(1); // For scaleing... responsive web design

	useCanvas(SCALAR, CanvasRef, CONFIG, setDrawingContext);

	const handleResize = useCallback(() => {
		if (!CONFIG)
			return ;

		if ((window.innerHeight / window.innerWidth) < (2/3))
		{
			setSCALAR(CONFIG.HEIGHT / (window.innerHeight * 0.85));
		}
		else
		{
			setSCALAR(CONFIG.WIDTH / (window.innerWidth * 0.85));
		}
		// setSCALAR(1); // Took out scaleing for css.
	}, [CONFIG])

	useEffect(() => { // As soon as we get the config we calculate the scalar.
		if (!CONFIG)
			return ;

		handleResize(); // call once even without resize.

		window.addEventListener('resize', handleResize)
		return (() => {
			window.removeEventListener('resize', handleResize);
		})
	}, [CONFIG, handleResize]) // Yields the SCALAR for further displays.

	const draw = useCallback(() => {
		if (!drawingContext || !CONFIG)
			return ;
		
		// clear(SCALAR, CONFIG, drawingContext);
		drawingContext.drawImage(backgroundImg.current, 0, 0, CONFIG.WIDTH / SCALAR, CONFIG.HEIGHT / SCALAR)
		if (gameStateRef.current)
		{
			dot(SCALAR, CONFIG, drawingContext, gameStateRef.current);
			paddle(SCALAR, CONFIG, drawingContext, gameStateRef.current, 1);
			paddle(SCALAR, CONFIG, drawingContext, gameStateRef.current, 2);
			Numbers({
				drawingContext: drawingContext,
				num: (gameStateRef.current.goalsPlayer1) ? gameStateRef.current.goalsPlayer1.toString() : '0' ,
				x: (CONFIG.WIDTH / 4) / SCALAR,
				y: (CONFIG.PADDING + 20) / SCALAR,
				font: `${40 / SCALAR}px Arial`
			})
			Numbers({
				drawingContext: drawingContext,
				num: (gameStateRef.current.goalsPlayer2) ? gameStateRef.current.goalsPlayer2.toString() : '0' ,
				x: ((CONFIG.WIDTH / 4) * 3) / SCALAR,
				y: (CONFIG.PADDING + 20) / SCALAR,
				font: `${40 / SCALAR}px Arial`
			})
			if (winningRef.current === winningStates.lost)
			{
				Numbers({drawingContext: drawingContext,
				num: 'YOU LOST',
				x: (CONFIG.WIDTH / 2) / SCALAR,
				y: (CONFIG.HEIGHT / 2) / SCALAR,
				font: `${80 / SCALAR} 'Press Start 2P', cursive`})
				setTimeout(() => clear(SCALAR, CONFIG, drawingContext), 4000);
			}
			else if (winningRef.current === winningStates.won)
			{
				Numbers({drawingContext: drawingContext,
					num: 'YOU WON',
					x: (CONFIG.WIDTH / 2) / SCALAR,
					y: (CONFIG.HEIGHT / 2) / SCALAR,
					font: `${80 / SCALAR} 'Press Start 2P', cursive`})
				
				setTimeout(() => clear(SCALAR, CONFIG, drawingContext), 4000);
			}
		}
	}, [drawingContext, CONFIG, SCALAR, backgroundImg, gameStateRef, winningRef])
	
	// <Means for animation>
	const LoopCallback = useCallback(() => {
		draw();
		requestAnimationFrame(LoopCallback);
	}, [draw])
	
	useAnimation(LoopCallback, drawingContext, CONFIG);

	return <canvas ref={CanvasRef} id='gameScreen'></canvas>
}