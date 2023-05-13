import { useCallback } from "react";
import { Socket } from "socket.io-client";
import { useKeydown } from "./useKeyhook";
import { useKeyup } from "./useKeyup";

export function useSocketEmission(socket: Socket<any, any> | null) {
	const handlekeydown = useCallback((ev: KeyboardEvent) => {
		const ArrowKeys: string [] = ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'];

		if (ArrowKeys.includes(ev.key))
			ev.preventDefault();

		if (!socket)
		{
			return ;
		}
		socket.emit('keydown', ev.code);
	}, [socket])
	
	const handlekeyup = useCallback((ev: KeyboardEvent) => {
		if (!socket)
		{
			return ;
		}
		socket.emit('keyup', ev.code);
	}, [socket])

	useKeydown(handlekeydown);
	useKeyup(handlekeyup);
}