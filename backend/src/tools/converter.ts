
import { Inject, Injectable } from "@nestjs/common";
import { GameState } from "../interfaces/GameState";
import { DebugService } from "../debug/debug.service";
import { not, number } from "mathjs";

export interface Column {
	player1?: string;
	player2?: string;
	gameState?: GameState;
}

export const alreadyDeleted: string [] = []; // MOCK
export let notFullyInitalized: string [] = []; // MOCK

@Injectable()
export class RelationalTable {
	public rows: Map<string, Column> = undefined;

	constructor (
		private debug: DebugService
	) 
	{
		this.rows = new Map<string, Column>();

		this.debug.add(() => {
			let acc: string = "";
			for (const row of this.rows)
			{
				acc += `->${row[1].player1}, ${row[1].player2}, ${(row[1].gameState) ? "defined" : "undefined"}<-`
			}
			return ["Relations", acc];
		})
	}

	getRelation(gid: string): Column
	{
		return this.rows.get(gid);
	}

	addRelation(gid: string, column: Column) {
		if (!this.rows.has(gid))
		{
			notFullyInitalized.push(gid);

			this.rows.set(gid, {...column});
		}
		else {

			notFullyInitalized = notFullyInitalized.filter((val: string) => {
				if (val === gid)
					return false;
				return true;
			})

			this.rows.set(gid, this.mergeColumns(this.rows.get(gid), column));
		}
	}

	removeRelation(gid: string): boolean {
		return this.rows.delete(gid);
		alreadyDeleted.push(gid);
	}

	mergeColumns(a: Column, b: Column): Column {
		return ({
			player1: a.player1 === undefined ? b.player1 : a.player1,
			player2: a.player2 === undefined ? b.player2 : a.player2,
			gameState: a.gameState === undefined ? b.gameState : a.gameState
		})
	}
}


