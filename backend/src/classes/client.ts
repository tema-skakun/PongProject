import { Socket } from 'socket.io';
import { GameState } from 'src/interfaces/GameState';

import { Key } from 'src/constants/constants';
import CONFIG from '../constants/constants';
import { resetGlobalPendingMatch } from 'src/modules/game/game.gateway';
import { UserService } from 'src/modules/user/user.service';
import { User } from 'src/entities';
import { MatchHistoryService } from 'src/modules/game/match-history/match-history.service';
import { MatchHistoryEntry } from 'src/entities/matchHistoryEntry/matchHistoryEntry.entity';
import { ArchivementsService } from 'src/modules/archivements/archivements.service';
import { archivement_vals } from 'src/entities/archivements/archivments.entity';

type EventFunction = (...args: any[]) => void;
type EventFunctionXClient = (player: Client) => EventFunction;

async function updateMatchHistory(winner: Client, looser: Client, userService: UserService, matchHistoryService: MatchHistoryService) {
	const looserEntity: User = await userService.findUserByIdAndGetRelated(looser.intraId, ['wonGames', 'lostGames']);
	const winnerEntity: User = await userService.findUserByIdAndGetRelated(winner.intraId, ['wonGames', 'lostGames']);

	console.log(`My intraa id: ${winnerEntity.intra_id}`);

	const matchHistoryEntry: MatchHistoryEntry = await matchHistoryService.create({
		winner: winnerEntity,
		winnerGoals: winner.goals,
		looser: looserEntity,
		looserGoals: looser.goals
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
		if (this.otherPlayerObj)
		{
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
			Error('involved Game is undefined at access');
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
			Error('Other player obj is undefined');
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
	// set cleanupHandlers(newCleanup: EventFunction) {
	// 	this._cleanupHandlers.push(newCleanup);
	// 	if (this._otherPlayerObj)
	// 		this._otherPlayerObj._cleanupHandlers.push(newCleanup);
	// 	else
	// 		throw Error('Other player attribute not set');
	// }
	// cleanUpListeners() {
	// 	for (const listener of this._cleanupHandlers)
	// 	{
	// 		this.offAny(listener);
	// 	}
	// }

	private _gameState: GameState;
	set gameState(gs: GameState) {
		this._gameState = gs;
		if (this._otherPlayerObj)
			this._otherPlayerObj._gameState = gs;
		else
			throw Error('Other player attribute not set');
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
			throw Error('Other player attribute not set');
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
		this._intraId = aCookie.intra_id;
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
	incr_goals() {
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
		this.coupledEmits('goal', (this.playernum === 1) ? 'player1' : 'player2' );
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

	coupledOn(clientEventName: string, eventFunctionXClient: EventFunctionXClient)
	{
		console.log(`Calling instance: ${this.playernum}`);
		// <Destructuring>
		const other: Client = this._otherPlayerObj;
		if (!other)
			throw Error('other player not in here');

		const myEventFunction: EventFunction = eventFunctionXClient(this);
		const otherEventFunction: EventFunction = eventFunctionXClient(other);
		// </Destructuring>

		this.onSave(clientEventName, myEventFunction);
		other.onSave(clientEventName, otherEventFunction);
	}

	onSave(eventName: string, eventFunction: EventFunction) {
		this.listnersToBeCleaned.push({name: eventName, func: eventFunction});
		this.on(eventName, eventFunction);
	}

	coupledEmits(eventName: string, data: string) {
		this.emit(eventName, data);
		if (!this._otherPlayerObj)
			throw Error('no other player on emission');
		else
			this._otherPlayerObj.emit(eventName, data);
	}
	// </coupled action>

	cancelGame() {
		this.cleanUp();
		this.key = Key.NoKey;
		this.zero_goals();
		this.otherPlayerObj.zero_goals();

		if (this.gameLoop)
			clearInterval(this.gameLoop);

		this.inGame = false;
		if (!this.otherPlayerObj)
			return;

		this.otherPlayerObj.key = Key.NoKey;
		this.otherPlayerObj.inGame = false;
		this.otherPlayerObj.cleanUp();
	}
  
	tearDown() {
		if (!this._otherPlayerObj)
		{
			console.log('other player not set');
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

	_digestCookie(cookieStr: string, decrypthMethod: any, decryptObj: any) {
		const searchStr: string = "accesToken=";
		const jwtToken: string = cookieStr.slice(searchStr.length + 1);
		const cookieContent: string | Record<string, any> = decrypthMethod.bind(decryptObj)(jwtToken);
		if (typeof cookieContent === 'string')
			throw Error('incomplete cookie');
		
		this.cookie = cookieContent;
		console.log(this._intraId)
	}

	get intraId(): number {
		return (this._intraId);
	}

  }


export function isClient(obj: any): obj is Client {
	return (obj.intraId);
}