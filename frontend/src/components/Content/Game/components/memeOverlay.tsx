import '../style/MemeOverlay.css'

export interface MemeArgs {
	showMeme: boolean;
	memeUrl: string;
}

const MemeOverlay: React.FC<MemeArgs> = ({showMeme, memeUrl}) => {
	return (
		<div className={`meme-overlay ${showMeme ? 'visible' : 'hidden'}`}>
			<img src={memeUrl} alt="Meme GIF" />
		</div>
	)
}

export default MemeOverlay;