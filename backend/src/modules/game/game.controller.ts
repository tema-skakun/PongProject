import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { clients } from "./game.gateway";
import JwtTwoFactorGuard from "src/GuardStrategies/Jwt2F.guard";


@Controller('preGame')
export class PreGameController {

	@Get('/:ws_id')
	@UseGuards(JwtTwoFactorGuard)
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