import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatusService } from './status.service';
import { User } from '../../entities/user/user.entity';
import { StatusController } from './status.controller';
import { UserModule } from '../user/user.module';

@Module({
	imports: [TypeOrmModule.forFeature([User]), UserModule],
	providers: [StatusService],
	controllers: [StatusController],
	exports: [StatusService]
})
export class StatusModule {}
