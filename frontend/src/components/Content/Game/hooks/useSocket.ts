// import { useState } from 'react';
import { useEffect } from 'react';
import { Socket } from 'socket.io-client';

export interface GameState {
	dotCoordinate : {
		x: number;
		y: number;
	};
	paddleY: number;
	paddleY2: number;
}

type SocketCallback = (passed: string) => void;

export function useSocket(socket: Socket<any, any>, event: string, callback: SocketCallback): void {
	useEffect(() => {
		socket.on(event, callback);
	
		return (() => {
			socket.off(event, callback); 
		}) // TAG this might fix issues with zombie event listeners from browser
	}, [socket, event, callback])
}
