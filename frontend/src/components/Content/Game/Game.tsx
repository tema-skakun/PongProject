import { Config } from './interfaces/config';
import { GameState } from './interfaces/gameState';

import { useRef, useState, useCallback, useEffect} from 'react';

import { QueueButton } from './components/matchmakeing_button';

import MemeOverlay from './components/memeOverlay';
import JSCookies from 'js-cookie';

import { Radio } from './components/radio';
import { Canvas } from './components/Canvas';
import { useSocketEmission } from './hooks/useSocketEmission';
import { useSocketRecieve } from './hooks/useSocketRecieve';
import { socket } from '../../../App';
import { InviteForm } from './components/inviteForm';
import 'reactjs-popup/dist/index.css';
import { InvitePopUp } from './components/InvitePopUp';
import axios, { AxiosResponse } from 'axios';

export enum archivements {
	chad,
	triggered
}

export enum winningStates {
	won,
	lost,
	undecided
}


function Game({CONFIG, setCONFIG, winningRef}: {CONFIG: Config, setCONFIG: Function, winningRef: React.MutableRefObject<winningStates>}) {
	// <Means for displaying>
	const backgroundImg: React.MutableRefObject<HTMLImageElement> = useRef((() => {
		const img = new Image();
		img.src = '/default.png';
		return img;
	})());
	const gameStateRef: React.MutableRefObject<GameState | null> = useRef(null)

	const [showMe, setShowMe] = useState<boolean>(false);
	const memeUrl = useRef<string>('/pug-dance.gif');
	// </Means for displaying>
	
	// <Stateful>
	const [displayBtn, setDisplayBtn] = useState<boolean>(true);
	const [displayPopUp, setDisplayPopUp] = useState<boolean>(false);
	// </Stateful>

	const toggleDisplayPupUp = useCallback(() => {
		setDisplayPopUp(!displayPopUp);
	}, [setDisplayPopUp, displayPopUp]);

	const displayMeme = useCallback((arch: archivements) => {
		if (arch === archivements.chad)
			memeUrl.current = '/pug-dance.gif';
		else
			memeUrl.current = '/pug-triggered.gif'
		
		setShowMe(true);
		setTimeout(() => {
			setShowMe(false)
		}, 3000);
	}, [])

	const queueBtnHandler = useCallback((event: any) => {
		// const newSocketConn: Socket<any, any> = io('http://localhost:6969/game', {
		// 	withCredentials: true,
		// 	path: '/gameListener'
		// });
		// if (newSocketConn)
		// 	setSocket(newSocketConn);
		if (socket)
		{
			console.log('Emits the join once more');
			socket.emit('join', JSON.stringify({}));
		}

		setDisplayBtn(false);
		event.preventDefault();

		return (() => {
			// if (!newSocketConn.disconnected)
			// {
			// 	newSocketConn.disconnect();
			// }
		})

	}, []);

	useSocketRecieve(socket,
		displayMeme,
		winningRef,
		gameStateRef,
		setDisplayBtn,
		setCONFIG,
		toggleDisplayPupUp,
		displayBtn);

	useSocketEmission(socket);
	
	if (displayBtn) {
		return		<div>
						<form>
							<Radio backgroundImg={backgroundImg} />
							<div>
								<QueueButton handler={queueBtnHandler}/>
							</div>
						</form>
					</div>
	}
	else {
		return (<div className='canvas-container'>
					<div className='canvas-wrapper'>
						<Canvas gameStateRef={gameStateRef} CONFIG={CONFIG} winningRef={winningRef} backgroundImg={backgroundImg} />
						<MemeOverlay showMeme={showMe} memeUrl={memeUrl.current}/>
					</div>
				</div>)
	}
}

export default Game;
