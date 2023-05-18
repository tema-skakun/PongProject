export type RadioIn = {backgroundImg: React.MutableRefObject<HTMLImageElement>};


export const Radio: React.FC<RadioIn> = ({backgroundImg}: RadioIn) => {
	return <div>
			<label htmlFor='frog' >FROGGY MODE</label>
				<input type="radio" name='costume' id="frog" value="frog" onChange={() => {backgroundImg.current.src = '/frog.jpeg'}}>
				</input>

			<label htmlFor='vanilla' >vanilla pong</label>
				<input type="radio" name='costume' id="vanilla" value="vanilla" onChange={() => {backgroundImg.current.src = '/default.png'}}>
				</input>

			<label htmlFor='xmas' >SANTAAAAA</label>
				<input onChange={() => {backgroundImg.current.src = '/xmas.jpeg'}} type="radio" name='costume' id="xmas" value="xmas">
				</input>
		</div>
}