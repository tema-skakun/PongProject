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
import { inspect } from 'util';
import style from './Game.module.css'

export enum archivements {
	chad,
	triggered
}

export enum winningStates {
	won,
	lost,
	undecided
}


function Game({CONFIG, setCONFIG, winningRef, backgroundImg, displayBtn, setDisplayBtn}: {CONFIG: Config, setCONFIG: Function, winningRef: React.MutableRefObject<winningStates>, backgroundImg: React.MutableRefObject<HTMLImageElement>, displayBtn: boolean, setDisplayBtn: (arg: boolean) => any}) {
	// <Means for displaying>
	const gameStateRef: React.MutableRefObject<GameState | null> = useRef(null)

	const [showMe, setShowMe] = useState<boolean>(false);
	const memeUrl = useRef<string>('/pug-dance.gif');
	// </Means for displaying>
	
	// <Stateful>
	// const [displayBtn, setDisplayBtn] = useState<boolean>(true);
	const [displayPopUp, setDisplayPopUp] = useState<boolean>(false);
	// </Stateful>

	const toggleDisplayPupUp = useCallback(() => {
		setDisplayPopUp(!displayPopUp);
	}, [setDisplayPopUp, displayPopUp]);

	useEffect(() => {
		if (!socket?.id)
		{
			return;
		}

		axios.get(`http://${process.env.REACT_APP_IP_BACKEND}:6969/status/ws/` + socket.id, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${JSCookies.get('accessToken')}`,
			}
		})
		.then(res => {
			const myStatus = res.data;
			if (myStatus === "INGAME")
			{
				setDisplayBtn(false);
			}
		})
		.catch(err => {
			throw err;
		})

	}, [])

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
		return (
			<div className={style.menu}>
				<form>
					<Radio backgroundImg={backgroundImg}/>
					<div>
						<QueueButton handler={queueBtnHandler}/>
					</div>
				</form>
			</div>
		)
	}
	else {
		return (
			<div className={style.canvasContainer}>
				<div>
					<Canvas gameStateRef={gameStateRef} CONFIG={CONFIG} winningRef={winningRef}
							backgroundImg={backgroundImg}/>
					<MemeOverlay showMeme={showMe} memeUrl={memeUrl.current}/>
				</div>
			</div>
		)
	}
}

export default Game;
