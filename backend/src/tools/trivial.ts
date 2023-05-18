import { Socket } from "socket.io";
import CONFIG from '../constants/constants';
import { random } from "mathjs";
import { Client } from "src/classes/client";



export function spawnY(): number {
	return random(CONFIG.SPAWN_EXCLUSION , CONFIG.HEIGHT - CONFIG.SPAWN_EXCLUSION);
}

export function socketToCookie(socket: Socket) : string
{
	if (!socket.handshake.headers.cookie)
	{
		console.warn('no cookie was set');
	}
	return (socket.handshake.headers.cookie)
}

export async function roomToSocket(namespace: any, room: string): Promise<Set<string>>
{
	return await namespace.adapter.sockets(new Set<string>([room]));
}

