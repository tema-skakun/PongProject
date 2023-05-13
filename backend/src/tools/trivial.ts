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
		throw Error('no cookie was set');
	return (socket.handshake.headers.cookie)
}

export async function roomToSocket(namespace: any, room: string): Promise<Set<string>>
{
	return await namespace.adapter.sockets(new Set<string>([room]));
}

export async function setOtherPlayer(client: Client, clients: Map<string, Client>) { // not working
	console.log(`client.nsp: ${client.nsp}, client.pendingMatchRequest: ${client.pendingMatchRequest}`);
	const socketIdsInRoom: Set<string> = await roomToSocket(client.nsp, client.pendingMatchRequest);
	
	const dummy = new Map();
	socketIdsInRoom.forEach((socketId: string) => {
		console.log(`Clients size: ${clients.size}`);
		clients.forEach((cl: Client) => {
			// console.log(`This should the other players socket.id: ${socketId}`);
			// console.log(`This is the other players socket.id: ${cl.id}`);
			// console.log(`This is the player twos socket.id: ${client.id}`);
			if (cl.id === socketId && client.id !== socketId) {
				client.otherPlayerObj = cl;
			}
		})
	})
}
