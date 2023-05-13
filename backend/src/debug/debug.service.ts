import { Injectable } from '@nestjs/common';
import { HUMAN_LOGGER, LOGGER } from './logger';

type DebugFunction = () => string [];

@Injectable()
export class DebugService {
	private states: DebugFunction [];

	private kickoff() {
		setInterval(() => {
			if (this.states.length > 0)
			{
				let acc_human = "";
				for (const state of this.states) {
					acc_human += state()[0] + ": " + state()[1];
				}
				acc_human += "    ";
				LOGGER.debug(acc_human)
			}
		}, 1000);
	}

	constructor() {
		this.states = [];
		this.kickoff()
	}

	add(callback: DebugFunction) {
		this.states.push(callback);
	}
}
