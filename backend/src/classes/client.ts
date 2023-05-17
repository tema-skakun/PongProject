import { Socket } from 'socket.io';
import { GameState } from 'src/interfaces/GameState';

import { Key } from 'src/constants/constants';
import CONFIG from '../constants/constants';
import { clients, resetGlobalPendingMatch } from 'src/modules/game/game.gateway';
import { UserService } from 'src/modules/user/user.service';
import { User } from 'src/entities';
import { MatchHistoryService } from 'src/modules/game/match-history/match-history.service';
import { MatchHistoryEntry } from 'src/entities/matchHistoryEntry/matchHistoryEntry.entity';
import { ArchivementsService } from 'src/modules/archivements/archivements.service';
import { archivement_vals } from 'src/entities/archivements/archivments.entity';
import { ClientStatus, metric } from 'src/modules/status/status.service';

type EventFunction = (...args: any[]) => void;
type EventFunctionXClient = (player: Client) => EventFunction;

async function updateMatchHistory(winner: Client, looser: Client, userService: UserService, matchHistoryService: MatchHistoryService) {
	const stashedWinnerGoals = winner.goals;
	const stashedLooserGoals = looser.goals;

	const looserEntity: User = await userService.findUserByIdAndGetRelated(looser.intraId, ['wonGames', 'lostGames']);
	const winnerEntity: User = await userService.findUserByIdAndGetRelated(winner.intraId, ['wonGames', 'lostGames']);

	console.log(`My intraa id: ${winnerEntity.intra_id}`);

	const matchHistoryEntry: MatchHistoryEntry = await matchHistoryService.create({
		winner: winnerEntity,
		winnerGoals: stashedWinnerGoals,
		looser: looserEntity,
		looserGoals: stashedLooserGoals
	})

	// console.log(`total losses before: ${looserEntity.lostGames}`)
	userService.incr_totalLosses(looserEntity);

	// const checkLooserEntity: User = await userService.findUserByIdAndGetRelated(looser.intraId, ['wonGames', 'lostGames']);
	// console.log(`total losses after: ${checkLooserEntity.lostGames}`)

	userService.incr_totalWins(winnerEntity);

	console.log(`lost games: ${looserEntity.lostGames.length}`);
	console.log(`intraId: ${looserEntity.intra_id}`);

	matchHistoryService.save(matchHistoryEntry);
}

export class Client extends Socket {

	private _inGame: boolean = false;
	get inGame(): boolean { return this._inGame; }
	set inGame(val: boolean) {
		if (this.otherPlayerObj)
		{
			this.otherPlayerObj.inGameUncoupled = val;
		}
		 this.inGameUncoupled = val; 
		}
	private set inGameUncoupled(val: boolean) { this._inGame = val; }

	public streak: number = 0;
	
	// <services>
	private userService: UserService;
	private matchHistoryService: MatchHistoryService;
	private archivmentService: ArchivementsService;
	// </services>

	// <outsourcing>
	private _playernum: number;

	get playernum(): number {
		return this._playernum
	}
	set playernum(val: number) {
		if (!val)
		{
			this.playernumUncoupled = undefined;
			return ;
		}

		this.setStatus(ClientStatus.INGAME, true);
		if (this.otherPlayerObj)
		{
			this.otherPlayerObj.setStatus(ClientStatus.INGAME, true);
			if (val === 1)
				this.otherPlayerObj.playernumUncoupled = 2;
			else
				this.otherPlayerObj.playernumUncoupled = 1;
		}
		this.playernumUncoupled = val;
	}
	set playernumUncoupled(val: number) {
		this._playernum = val;
	}
	
	public key: Key;
	// </outsourcing>
	
	// <shared>
	private _involvedGame: string;
	set involvedGame(ig: string)
	{
		this._involvedGame = ig;
	}
	get involvedGame(): string {
		if (!this._involvedGame)
			console.warn('involved Game is undefined at access');
		return this._involvedGame;
	}

	private _otherPlayerObj: Client;
	set otherPlayerObj(op: Client) {
		this._otherPlayerObj = op;
		this._otherPlayer = op.id;

		op._otherPlayerObj = this;
		op._otherPlayer = this.id;
	}
	get otherPlayerObj(): Client {
		if (!this._otherPlayerObj)
		{
			console.warn('Other player obj is undefined');
		}
		return this._otherPlayerObj;
	}

	private _otherPlayer: string; // gets set when _otherPlayerObj is set.
	get otherPlayer(): string {
		return (this._otherPlayer);
	}

	private listnersToBeCleaned:  {name: string; func: EventFunction} [] = [];
	cleanUp() {
		for (const listener of this.listnersToBeCleaned)
		{
			this.off(listener.name, listener.func);
		}
	}

	private _listenersToBeReactivated: {name: string, func: EventFunction} [] = [];
	reactivateListeners() {
		for (const listener of this._listenersToBeReactivated)
		{
			if (this.listenerCount(listener.name) === 0)
			{
				console.log(`Reactivates: ${listener.name}`)
				this.on(listener.name, listener.func);
			}
		}
	}
	addReactivator(name: string, func: EventFunction) {
		console.log(`Adds Reactivator for: ${name}`);
		this.off(name, func);
		this._listenersToBeReactivated.filter(list => list.name !== name);
		this._listenersToBeReactivated.push({name: name, func: func});
	}

	private _gameState: GameState;
	set gameState(gs: GameState) {
		this._gameState = gs;
		if (this._otherPlayerObj)
			this._otherPlayerObj._gameState = gs;
		else
			console.warn('Other player attribute not set');
	}
	get gameState(): GameState {
		return this._gameState;
	}

	private _gameLoop: NodeJS.Timer;
	set gameLoop(gl: NodeJS.Timer)
	{
		this._gameLoop = gl;
		if (this._otherPlayerObj)
			this._otherPlayerObj._gameLoop = gl;
		else
		{
			console.warn('Other player attribute not set');
		}
	}
	get gameLoop(): NodeJS.Timer | undefined {
		return this._gameLoop;
	}
	// </shared>
	
	// <coupled action>
	private _cookie: Record<string, any>;
	private _intraId: number;
	set cookie(aCookie: Record<string, any>) {
		this._cookie = aCookie;
		this._intraId = Number(aCookie.intra_id);
	}
	get cookie(): Record<string, any> {
		return (this._cookie);
	}

	private _pendingMatchRequest: string;
	async setPendingMatchRequest(uuid: string) {
		if (this.otherPlayerObj)
		{
			await this.otherPlayerObj.join(uuid);
			this.otherPlayerObj.pendingMatchRequestUncoupled = uuid;
		}
		await this.join(uuid);
		this.pendingMatchRequestUncoupled = uuid;
	}
	set pendingMatchRequestUncoupled(uuid: string) {
		this._pendingMatchRequest = uuid;
	}
	get pendingMatchRequest(): string {
		return this._pendingMatchRequest;
	}

	private _goals: number = 0;
	zero_goals() {
		this.streak = 0;
		this._goals = 0;
	}
	async incr_goals() {
		const other: Client = this._otherPlayerObj;
		other.streak = 0;
		++this.streak;

		if (this.streak === 3)
		{
			this.emit('tripple streak');
			this.archivmentService.addArchivement(archivement_vals.chad, this.intraId);
			other.emit('tripple loose');
			this.archivmentService.addArchivement(archivement_vals.triggered, other.intraId);
		}

		++this._goals;
		if (this._goals === CONFIG.POINTS)
		{
			this.emit('winner');
			other.emit('looser');

			updateMatchHistory(this, other, this.userService, this.matchHistoryService);

			this.cancelGame();
		}
	}
	get goals(): number {
		return this._goals;
	}

	coupledHandshake() {
		const intervalId: NodeJS.Timer =  setInterval(() => {
		this.emit('handshake', JSON.stringify(CONFIG)); }, 100)

		if (this.otherPlayerObj)
		{
			const intervalId2: NodeJS.Timer =  setInterval(() => {
			this.otherPlayerObj.emit('handshake', JSON.stringify(CONFIG)); }, 100)

			setTimeout(() => {
				clearInterval(intervalId2);
			}, 1000);
		}

		setTimeout(() => {
		  clearInterval(intervalId);
		}, 1000);
	}


	coupledOn(clientEventName: string, eventFunctionXClient: EventFunctionXClient)
	{
		console.log(`Calling instance: ${this.playernum}`);
		// <Destructuring>

		const myEventFunction: EventFunction = eventFunctionXClient(this);
		// </Destructuring>
		
		this.onSave(clientEventName, myEventFunction);

		const other: Client = this._otherPlayerObj;
		if (!other)
		{
			console.info('other player not in here');
			return ;
		}

		const otherEventFunction: EventFunction = eventFunctionXClient(other);
		other.onSave(clientEventName, otherEventFunction);
	}

	onSave(eventName: string, eventFunction: EventFunction) {
		this.listnersToBeCleaned.push({name: eventName, func: eventFunction});
		this.on(eventName, eventFunction);
	}

	coupledEmits(eventName: string, data: string) {
		this.emit(eventName, data);
		if (!this._otherPlayerObj)
			console.warn('no other player on emission')
		else
			this._otherPlayerObj.emit(eventName, data);
	}
	// </coupled action>

	cancelPlayer()
	{
		this.setStatus(ClientStatus.CONNECTED, false);
		this.cleanUp();
		this.key = Key.NoKey;
		this.zero_goals();
		this.playernumUncoupled = undefined;

		if (this.gameLoop)
			clearInterval(this.gameLoop);

		this.inGame = false;
		console.log(`Reactivate listerns is called`);
		this.reactivateListeners();
	}

	cancelGame() {
		this.cancelPlayer();

		if (!this.otherPlayerObj)
			return;

		this.otherPlayerObj.cancelPlayer();
	}

	emitStatusChange(status: ClientStatus) {
		if (!clients)
			return ;
	
		console.log('only gets till here');
		for (const client of clients)
		{
			if (this.befriendedBy.has(client[1].intraId))
			{
				console.log('gets till the emit');
				client[1].emit('statusChange', {
					intra_id: this.intraId,
					newStatus: status
				})
			}
		}

	}
  
	tearDown() {
		console.log('tears down client');
		this.setStatus(ClientStatus.OFFLINE, false);
		if (!this._otherPlayerObj)
		{
			resetGlobalPendingMatch();
			return ;
		}
		this.cancelGame();

		this.otherPlayerObj.emit('playerDisconnect');
	}

	constructor(socket: Socket, userService: UserService, matchHistoryService: MatchHistoryService, archivementService: ArchivementsService) {
	  super(socket.nsp, socket.client, {
		token: "123"
	  });
	  Object.assign(this, socket);
  
	  this.playernum = undefined;
	  this.userService = userService;
	  this.matchHistoryService = matchHistoryService;
	  this.archivmentService = archivementService;
  
	  console.log(`client in: ${this.id}`);
	}

	private befriendedBy: Set<number> = new Set();
	private _status: ClientStatus = ClientStatus.OFFLINE;

	setStatus(newStatus: ClientStatus, moreEngaged: boolean)
	{
		console.log('RIGHT AFTER DIGESTING');
		console.log(`for user: ${this.intraId}`);
		console.log(`change to ${newStatus}, wich is more engaged? ${moreEngaged} then ${this._status}}`)
		if ( (metric(this._status, newStatus) >= 0) && moreEngaged)
		{
			console.log('hits with' + newStatus);
			this._status = newStatus;
			this.emitStatusChange(newStatus);
		}
		else if ( (metric(this._status, newStatus) <= 0) && !moreEngaged)
		{
			console.log('hits the other one' + newStatus);
			this._status = newStatus;
			this.emitStatusChange(newStatus);
		}
	}

	async _digestCookie(cookieStr: string, decrypthMethod: any, decryptObj: any) {
		const searchStr: string = "accesToken=";
		const jwtToken: string = cookieStr.slice(searchStr.length + 1);
		const cookieContent: string | Record<string, any> = decrypthMethod.bind(decryptObj)(jwtToken);
		if (typeof cookieContent === 'string')
		{
			console.warn('incomplete cookie');
			return ;
		}
		
		this.cookie = cookieContent;
		this.befriendedBy =  await this.userService.findBefrienders(this.intraId);
		this.setStatus(ClientStatus.CONNECTED, true);
	}

	get intraId(): number {
		return (this._intraId);
	}

  }


export function isClient(obj: any): obj is Client {
	return (obj.intraId);
}