import React, { useCallback } from "react";
import { Socket } from "socket.io-client";
import { archivements, winningStates } from "../Game";
import { GameState } from "../interfaces/gameState";
import { useEffect } from "react";

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
					setTimeout(() => {
						gameStateRef.current = null;
						setDisplayBtn(true);
						winningRef.current = winningStates.undecided;
					}, 3000);
					break;
				case 'gameState':
					if (displayBtn)
						setDisplayBtn(false);
					gameStateRef.current = JSON.parse(args[0] as string);
					break;
				case 'playerDisconnect':
					setDisplayBtn(true);
					gameStateRef.current = null;
					winningRef.current = winningStates.undecided;
					break;
				case 'handshake':
					break;
				default:
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
