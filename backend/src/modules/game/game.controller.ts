import { Controller, Get, Param } from "@nestjs/common";
import { clients } from "./game.gateway";


@Controller('preGame')
export class PreGameController {

	@Get('/:ws_id')
	isAlreadyInGame(@Param('ws_id') ws_id: string): boolean {
		if (!clients || clients.size === 0)
			return false;

		for (const player of clients.values())
		{
			if (player.id === ws_id && player.playernum)
				return true;
		}
		return false;
	}

}