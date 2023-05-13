import React, { useCallback } from "react";
import { Socket } from "socket.io-client";
import { archivements, winningStates } from "../Game";
import { GameState } from "./useSocket";
import { useEffect } from "react";

// function attach(socket: Socket<any, any>, event: string, cb: Function) {
// 	if (!socket.hasListeners(event))
// 	{
// 		socket.on(event, cb);
// 	}
// }

export function useSocketRecieve(socket: Socket<any, any> | null,
	displayMeme: (a: archivements) => void,
	winningRef: React.MutableRefObject<winningStates>,
	goalsPlayerOne: React.MutableRefObject<number>,
	goalsPlayerTwo: React.MutableRefObject<number>,
	gameStateRef: React.MutableRefObject<GameState | null>,
	setDisplayBtn: Function,
	setCONFIG: Function,
	toggleDisplayPopUp: () => void,
	setInvitedBy: Function) {

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
					setInvitedBy([args[0], args[1]]);
					toggleDisplayPopUp();
					break;
				case 'tripple loose':
					{
					displayMeme(archivements.triggered);
					break;
					}
				case 'winner':
					winningRef.current = winningStates.won;
					goalsPlayerOne.current = 0;
					goalsPlayerTwo.current = 0;;
					console.log('winner started');
					setTimeout(() => {
						console.log('winner ended');
						gameStateRef.current = null;
						setDisplayBtn(true);
						winningRef.current = winningStates.undecided;
					}, 3000);
					break;
				case 'looser':
					winningRef.current = winningStates.lost;
					goalsPlayerOne.current = 0;
					goalsPlayerTwo.current = 0;
					console.log('winner ended');
					setTimeout(() => {
						console.log('winner ended');
						gameStateRef.current = null;
						setDisplayBtn(true);
						winningRef.current = winningStates.undecided;
					}, 3000);
					break;
				case 'disconnect':
					console.log('disconnected');
					goalsPlayerOne.current = 0;
					goalsPlayerTwo.current = 0;
					setTimeout(() => {
						gameStateRef.current = null;
						setDisplayBtn(true);
						winningRef.current = winningStates.undecided;
					}, 3000);
					break;
				case 'handshake':
					setDisplayBtn(false);
					console.log('HANDSHAKE');
					setCONFIG(JSON.parse(args[0] as string))
					break;
				case 'gameState':
					console.log('GAMESTATE');
					gameStateRef.current = JSON.parse(args[0] as string);
					break;
				case 'goal':
					console.log('A GOOAL HAS HAPPENDED');
					if (args[0] === 'player1')
					{
						++goalsPlayerOne.current;
					}
					else if (args[0] === 'player2')
					{
						++goalsPlayerTwo.current;
					}
					break;
				case 'playerDisconnect':
					console.log('player disconnected');
					setDisplayBtn(true);
					goalsPlayerOne.current = 0;
					goalsPlayerTwo.current = 0;
					gameStateRef.current = null;
					winningRef.current = winningStates.undecided;
					break;
				default:
					console.log('no such listener');
					break;
			}
		})

		return (() =>
		{
			console.log('Deactivating');
			socket.offAny();
		}
		)
	}, [socket, displayMeme,
	winningRef,
	setDisplayBtn,
	goalsPlayerOne,
	goalsPlayerTwo,
	setCONFIG,
	gameStateRef])

	useEffect(manageSocketConnection, [manageSocketConnection]);
}
