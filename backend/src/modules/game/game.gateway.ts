import { WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

// <self defined>
import { GameService } from './gameService';
import CONFIG from '../../constants/constants';
import { RelationalTable, Column } from '../../tools/converter';
import * as crypto from 'crypto';
// import crypto from 'crypto';
import { Client, isClient } from '../../classes/client';

import { roomToSocket, setOtherPlayer, socketToCookie } from 'src/tools/trivial';
import { GameState } from 'src/interfaces/GameState';
import { json } from 'stream/consumers';
import { arrayNotEmpty } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MatchHistoryEntry } from 'src/entities/matchHistoryEntry/matchHistoryEntry.entity';
import { UserService } from '../user/user.service';
import { MatchHistoryService } from './match-history/match-history.service';
import { ArchivementsService } from '../archivements/archivements.service';
// </self defined>

export const clients = new Map<string, Client>();

type KeyHandler = (...args: any[]) => void;
type KeyHandlerXClient = (player: Client) => KeyHandler; 

let pendingMatchRequest: string = undefined;
export const resetGlobalPendingMatch = () => {pendingMatchRequest = undefined}

@WebSocketGateway({
	cors: {
			origin: (origin: string, callback: (err: Error | null, allow?: boolean) => void) => {
				// Replace this with your own logic to validate the request's origin.
				// For example, you can check against a list of allowed origins.
				const isOriginAllowed = true; // Your validation logic here
				callback(null, isOriginAllowed);
		},
		credentials: true
	},
	namespace: '/game',
	path: '/gameListener',
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {

  // <state>
  @WebSocketServer() server: Server;
  // </state>

  constructor(private gameService: GameService,
	private userService: UserService,
	private matchHistoryService: MatchHistoryService,
	private jwtService: JwtService,
	private archivmentService: ArchivementsService)
	{
	}

  // note: communicating to service over relationalTable sigleton instance
  start(player2: Client): void {

		player2.inGame = true;
		// <streamline>
		const keyHandlerXClientFactory = (activate: boolean): KeyHandlerXClient  => {
				return (player: Client) => (code: string) => {
					this.gameService.keyChange(code, player, activate);
				}
		}
		const player1: Client = player2.otherPlayerObj;
		// </streamline>

		this.gameService.createGame(player2);

		// <eventHandlers>
			player2.coupledOn('keydown', keyHandlerXClientFactory(true));
			player2.coupledOn('keyup', keyHandlerXClientFactory(false));
		// </eventHandlers>

	// <Loop>
		player2.gameLoop = setInterval(async () => {
		this.gameService.physics(player2);

		// <Emission>
		player2.coupledEmits('gameState', JSON.stringify(player2.gameState));

		const goals: string = this.gameService.goals(player2);
		if (goals === 'goal player1')
		{
			player1.incr_goals();
			console.log('emitted one goal for player1');
		}
		else if (goals === 'goal player2')
		{
			player2.incr_goals();
			console.log('emitted one goal for player2');
		}
		// </Emission>

		}, CONFIG.UPDATE_INTERVAL)
	// </Loop>
  }

  async join(client: Client, JoinOpts: Object) {

    if (pendingMatchRequest) {
		client.playernum = 2;
		await client.setPendingMatchRequest(pendingMatchRequest);
  
		await setOtherPlayer(client, clients);
  
		this.start(client);
		pendingMatchRequest = undefined;
  
	  } else { 
		client.playernum = 1;
		console.log(`playernum: ${client.playernum}`); 
  
		pendingMatchRequest = crypto.randomUUID();
		await client.setPendingMatchRequest(pendingMatchRequest);
	  }
  
	  client.emit('handshake', JSON.stringify(CONFIG));
	//   client.onSave('disconnect', () => {
	// 	  console.log(`client out (ignore doubles): ${client.id}`);
	// 	  client.tearDown();
	//   })
  }

  async handleConnection(socket: Socket): Promise<void> { // Lobby

		const client: Client = new Client(socket, this.userService, this.matchHistoryService, this.archivmentService);
	try {
		client._digestCookie(socketToCookie(socket), this.jwtService.decode, this.jwtService);
	} catch (err) {
		console.log(err.message);
		client.disconnect();
	}
		clients.set(client.id, client);
	

	// setInterval(() => {
		// console.log(clients.size);
		// clients.forEach((cl: Client) => {
		// 	(cl.inGame) ? console.log('inGame') : console.log('not inGame');
		// })
	// }, 1000);

	// Waiting for 'join' event.
	const joinCb = (JoinOptsStr: string) => {
		// client.off('join', joinCb);
		// console.log('GETS INTO THE JOIN CALLBACK');
		const JoinOpts: Object = JSON.parse(JoinOptsStr);
		this.join(client, JoinOpts);
	}

	client.on('invite', (intraIdStr: number, callback: (res: string) => void) => {

		clients.forEach((cl: Client) => {
			// console.log(`in the set: ${cl.id}`);
			if ((cl.intraId === intraIdStr) && (client.id !== cl.id))
			{
				cl.emit('inviteReq', client.intraId, (resToServer: string) => {
					if (resToServer === 'I will destory you') // Client accepted the game
					{
						client.off('join', joinCb);
						cl.off('join', joinCb);
						this.kickoffGroup(client, cl);
					}

					callback(resToServer);
				});
			}
		})



	})

	client.on('join', joinCb);

	client.on('disconnect', () => {
		// console.log(`client out (ignore doubles): ${client.id}`);
		client.inGame = false;
		client.tearDown();
	})
  }

  kickoffGroup(inviter: Client, invitee: Client) {
	inviter.otherPlayerObj = invitee;
	inviter.playernum = 2;
	inviter.setPendingMatchRequest(crypto.randomUUID());

	inviter.coupledEmits('handshake', JSON.stringify(CONFIG));
	this.start(inviter);
  }

  handleDisconnect(client: any) { // Not used because to little parameters.
	clients.delete(client.id);
  }

}
