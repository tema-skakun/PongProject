import { Injectable } from '@nestjs/common';
import { clients } from '../game/game.gateway';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user/user.entity';

export enum ClientStatus {
	CONNECTED = 'CONNECTED',
	INGAME = 'INGAME',
	OFFLINE = 'OFFLINE',
}

export function metric(before: ClientStatus, after: ClientStatus): number {

	const map = new Map<ClientStatus, number>();
	map.set(ClientStatus.OFFLINE, 0);
	map.set(ClientStatus.CONNECTED, 1);
	map.set(ClientStatus.INGAME, 2);

	return map.get(after) - map.get(before);
}

@Injectable()
export class StatusService {

	constructor(@InjectRepository(User) private readonly userRepo: Repository<User>) {}

	async getStatus(): Promise< Map<number, ClientStatus>> {
		const statusMap:  Map<number, ClientStatus> = new Map();
		const dbClients: User [] = await this.userRepo.find();

		dbClients.forEach((dbClient) => {
				statusMap.set(Number(dbClient.intra_id), ClientStatus.OFFLINE);
		});

		console.log(`clients size: ${clients.size}`);
		clients.forEach((client, socketId) => {
			if (statusMap.get(clients.get(socketId).intraId) !== ClientStatus.INGAME )
				statusMap.set( clients.get(socketId).intraId , client.playernum ? ClientStatus.INGAME : ClientStatus.CONNECTED)
		});

		statusMap.forEach((intra, key) => {
			console.log(`value : ${intra}`);
			console.log(`key: ${key}`);
			console.log(`typeof key: ${typeof key}`);
		})
		return statusMap;
	}
}
