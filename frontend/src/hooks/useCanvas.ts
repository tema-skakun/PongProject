import { useEffect } from 'react';
import { Config } from '../interfaces/config';


export function useCanvas(CanvasRef: React.RefObject<HTMLCanvasElement>, CONFIG: Config | null, setDrawingContext: React.Dispatch<React.SetStateAction<CanvasRenderingContext2D | null>>) {
	useEffect(() => {
		if (!CanvasRef.current || !CONFIG)
			return ;

		CanvasRef.current.width = CONFIG.WIDTH;
		CanvasRef.current.height = CONFIG.HEIGHT;

		const maybeContext: CanvasRenderingContext2D | null  = CanvasRef.current.getContext('2d');
		if (!maybeContext)
			return;

		setDrawingContext(maybeContext);
	}, [CONFIG, CanvasRef, setDrawingContext])
}
