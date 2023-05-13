import { useEffect } from 'react';
import { Config } from '../interfaces/config';

type LoopCallback = () => void;

export let drawingContext: CanvasRenderingContext2D | null = null;

export function useAnimation(loopCallback: LoopCallback, RenderingContext: CanvasRenderingContext2D | null, CONFIG: Config | null) {
	useEffect(() => {
		if (!RenderingContext || !CONFIG)
			return ;

		const animationId: number = requestAnimationFrame(loopCallback)
		return ( () => cancelAnimationFrame(animationId) )
	}, [loopCallback, RenderingContext, CONFIG])
}
