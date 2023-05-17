import { Get, Injectable, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';
import { Archivements, archivement_vals } from 'src/entities/archivements/archivments.entity';
import { Repository } from 'typeorm';
import { User } from 'src/entities';

@Injectable()
export class ArchivementsService {
	constructor(
		@InjectRepository(Archivements) private rep: Repository<Archivements>,
		private usrService: UserService,
	) {}

	async addArchivement(type: archivement_vals, intraId: number)
	{
		const archivmentEntity: Archivements = new Archivements();
		const user: User = await this.usrService.findUsersById(intraId);
		
		const archivementsArr: Archivements [] = await this.rep.find();
		archivementsArr.filter(arch => arch.type === type);
		if (archivementsArr.length === 0)
		{
			archivmentEntity.holder = user;
			archivmentEntity.type = type;
			this.rep.save(archivmentEntity);
		}
	}
}
