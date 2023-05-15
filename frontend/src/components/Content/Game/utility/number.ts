export type NumberProps = {
	drawingContext: CanvasRenderingContext2D | null;

	num: string;
	x: number;
	y: number;

	font: string;
	color?: string;
};

export const Numbers = ({
	drawingContext,
	num,
	x,
	y,
	font,
	color = 'white'
}: NumberProps) => {
	if (!drawingContext)
		return ;
	drawingContext.fillStyle = color;
	drawingContext.font = font;

	drawingContext.fillText(num, x - drawingContext.measureText(num).width / 2, y);
}
