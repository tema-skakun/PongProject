import React, { useCallback } from "react";
import { Socket } from "socket.io-client";
import { archivements, winningStates } from "../Game";
import { GameState } from "../interfaces/gameState";
import { useEffect } from "react";
import { timeLog } from "console";

export function useSocketRecieve(socket: Socket<any, any> | null,
	displayMeme: (a: archivements) => void,
	winningRef: React.MutableRefObject<winningStates>,
	gameStateRef: React.MutableRefObject<GameState | null>,
	setDisplayBtn: Function,
	setCONFIG: Function,
	toggleDisplayPopUp: () => void,
	displayBtn: boolean) {

	const manageSocketConnection = useCallback(() => {
		if (!socket)
			return ;

		socket.onAny((eventName: string, ...args: unknown []) => {
			if (typeof args[0] !== 'string' && typeof args[0] !== 'undefined')
			{
				return ;
			}

			switch (eventName) {
				case 'tripple streak':
					displayMeme(archivements.chad);
					break;
				case 'inviteReq':
					console.log(`recieved invite Req`);
					toggleDisplayPopUp();
					break;
				case 'tripple loose':
					{
					displayMeme(archivements.triggered);
					break;
					}
				case 'winner':
					winningRef.current = winningStates.won;
					setTimeout(() => {
						gameStateRef.current = null;
						setDisplayBtn(true);
						winningRef.current = winningStates.undecided;
					}, 3000);
					break;
				case 'looser':
					winningRef.current = winningStates.lost;
					setTimeout(() => {
						gameStateRef.current = null;
						setDisplayBtn(true);
						winningRef.current = winningStates.undecided;
					}, 3000);
					break;
				case 'disconnect':
					console.log('disconnected');
					setTimeout(() => {
						gameStateRef.current = null;
						setDisplayBtn(true);
						winningRef.current = winningStates.undecided;
					}, 3000);
					break;
				case 'gameState':
					console.timeLog();
					console.timeEnd();
					console.time();
					if (displayBtn)
						setDisplayBtn(false);
					gameStateRef.current = JSON.parse(args[0] as string);
					break;
				case 'playerDisconnect':
					console.log('player disconnected');
					setDisplayBtn(true);
					gameStateRef.current = null;
					winningRef.current = winningStates.undecided;
					break;
				case 'handshake':
					// console.log('moved to app.tsx');
					break;
				default:
					console.log('no such listener');
					break;
			}
		})

		return (() =>
		{
			socket.offAny();
		}
		)
	}, [socket, displayMeme,
	winningRef,
	setDisplayBtn,
	setCONFIG,
	gameStateRef])

	useEffect(manageSocketConnection, [manageSocketConnection]);
}
