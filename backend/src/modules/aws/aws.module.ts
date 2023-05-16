import { Module } from '@nestjs/common';
import { AwsService } from './aws.service';
import { AwsController } from './aws.controller';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';
import { UserModule } from '../user/user.module';


@Module({
	imports: [MulterModule.register({
		storage: multer.memoryStorage(),
	}), UserModule],
  providers: [AwsService],
  controllers: [AwsController],
  exports: [AwsService]
})
export class AwsModule {}
