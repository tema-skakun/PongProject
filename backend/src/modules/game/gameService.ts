import { Injectable } from "@nestjs/common";
import CONFIG, { Key, randomVelocity } from '../../constants/constants';
import * as math from 'mathjs';
import { getHitPoint, deflection } from "../../tools/linearAlgebra"

import { GameState } from '../../interfaces/GameState'
import { alreadyDeleted, notFullyInitalized, RelationalTable } from '../../tools/converter';
import { hasNumericValue, random } from "mathjs";
import { getPaddleBox, getPaddleBox2, getDotBox } from "../../tools/physicalObjects";
import { Client } from "src/classes/client";

import { UserRestriction } from "src/classes/UserRestriction";
import { spawnY } from "src/tools/trivial";


const UPPERBOUND: math.Matrix = math.matrix([
	[0, CONFIG.WIDTH],
	[CONFIG.HEIGHT, CONFIG.HEIGHT + 10]
])

const LOWERBOUND: math.Matrix = math.matrix([
	[0, CONFIG.WIDTH],
	[10, 0]
])


@Injectable()
export class GameService {
	constructor(private relations: RelationalTable,
				private userRestriction: UserRestriction) {}

	createGame(player2: Client) {
		player2.gameState = {...CONFIG.initialState, dotCoordinate: {...CONFIG.initialState.dotCoordinate}, velocity: randomVelocity()};
	}
	
	physics(player2: Client): void {
			// <Destructuring>
			const gState: GameState = player2.gameState;
			const player1: Client = player2.otherPlayerObj;
			// </Destructuring>

			if (!gState.dotCoordinate.y)
				gState.dotCoordinate.y = random(CONFIG.SPAWN_EXCLUSION , CONFIG.HEIGHT - CONFIG.SPAWN_EXCLUSION);

			// <Object boundaries>
				const Dot_box: math.Matrix = getDotBox(gState);
				const Paddle_box: math.Matrix = getPaddleBox(gState);
				const Paddle_box2: math.Matrix = getPaddleBox2(gState);
			// </Physical objects>

			// console.log('velocity before:' + gState.velocity);
			let hitPoint: number = 0;
			if (getHitPoint(Dot_box, UPPERBOUND) || getHitPoint(Dot_box, LOWERBOUND))
			{
				gState.velocity = deflection({velocity: gState.velocity})
			}
			if ((hitPoint = getHitPoint(Dot_box, Paddle_box)) !== undefined)
			{
				gState.velocity = deflection({velocity: gState.velocity, paddle: {hitPoint: hitPoint, paddleNr: 1}})
			}
			if ((hitPoint = getHitPoint(Dot_box, Paddle_box2)) !== undefined)
			{
				gState.velocity = deflection({velocity: gState.velocity, paddle: {hitPoint: hitPoint, paddleNr: 2}})
			}
			// console.log('velocity after:' + gState.velocity);

			gState.dotCoordinate.x += gState.velocity.get([0, 0]);
			gState.dotCoordinate.y += gState.velocity.get([1, 0]);

			if (player1.key === Key.ArrowUp)
			{
				if ((gState.paddleY) < 0)
				{}
				else
					gState.paddleY -= CONFIG.PADDLE_SPEED / 60;
			}
			if (player2.key === Key.ArrowUp)
			{
				if ((gState.paddleY2) < 0)
				{}
				else
					gState.paddleY2 -= CONFIG.PADDLE_SPEED / 60;
			}

			if (player1.key === Key.ArrowDown)
			{
				if ((gState.paddleY + CONFIG.PADDLE_HEIGHT) > CONFIG.HEIGHT)
				{}
				else
					gState.paddleY += CONFIG.PADDLE_SPEED / 60;
			}
			if (player2.key === Key.ArrowDown)
			{
				if ((gState.paddleY2 + CONFIG.PADDLE_HEIGHT) > CONFIG.HEIGHT)
				{}
				else
					gState.paddleY2 += CONFIG.PADDLE_SPEED / 60;
			}
			
	}

	goals(player2: Client): string {
		// <Destructuring>
		const gState: GameState = player2.gameState;
		const dotCoordinate: {x: number, y: any} = gState.dotCoordinate;
		const x = dotCoordinate.x;
		const y = dotCoordinate.y;
		const CONFIG_X = CONFIG.initialState.dotCoordinate.x;
		const WIDTH = CONFIG.WIDTH;
		// </Destructuring>

		if (x < 0)
		{
				dotCoordinate.x = CONFIG_X;
				gState.dotCoordinate.y = spawnY();
			gState.velocity = randomVelocity();
			return ('goal player2');
		}
		else if (x > WIDTH)
		{
				dotCoordinate.x = CONFIG_X;
				gState.dotCoordinate.y = spawnY();
			gState.velocity = randomVelocity();
			return ('goal player1');
		}
	
		return ('none');
	}

	keyChange(code: string, player: Client, activate: boolean) {

		if (!activate)
		{
			player.key = Key.NoKey;
			return ;
		}

		if (code == 'ArrowDown')
			player.key = Key.ArrowDown;
		else if (code == 'ArrowUp')
			player.key = Key.ArrowUp;
	}

}
