import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Archivements } from 'src/entities/archivements/archivments.entity';
import { UserModule } from '../user/user.module';
import { ArchivementsController } from './archivements.controller';
import { ArchivementsService } from './archivements.service';

@Module({
	imports: [TypeOrmModule.forFeature([Archivements]), UserModule],
  controllers: [ArchivementsController],
  providers: [ArchivementsService],
  exports: [ArchivementsService]
})
export class ArchivementsModule {}
