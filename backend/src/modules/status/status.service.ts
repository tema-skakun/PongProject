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

@Injectable()
export class StatusService {

	constructor(@InjectRepository(User) private readonly userRepo: Repository<User>) {}

	async getStatus(): Promise< Map<number, ClientStatus>> {
		const statusMap:  Map<number, ClientStatus> = new Map();
		const dbClients: User [] = await this.userRepo.find();

		dbClients.forEach((dbClient) => {
			clients.forEach((client) => {
				if (client.intraId === dbClient.intra_id)
					statusMap.set(dbClient.intra_id, ClientStatus.OFFLINE);
			})
		});

		clients.forEach((client, socketId) => {
			statusMap.set(clients.get(socketId).intraId , client.inGame ? ClientStatus.INGAME : ClientStatus.CONNECTED)
		});

		return statusMap;
	}
}
