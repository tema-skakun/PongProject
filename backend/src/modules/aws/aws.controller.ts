import { Controller, Post, UploadedFile, Get, Put, Req, UseInterceptors, UseGuards } from '@nestjs/common';
import { AwsService } from './aws.service';
import { inspect } from 'util';
import { FileInterceptor } from '@nestjs/platform-express';
import JwtTwoFactorGuard from 'src/GuardStrategies/Jwt2F.guard';

@Controller('aws')
export class AwsController {

	constructor(
		private awsService: AwsService
	) {

	}

	@Put('/upload') //  Protect for invalid input.
	@UseInterceptors(FileInterceptor('file'))
	@UseGuards(JwtTwoFactorGuard)
	async uploadFile(@UploadedFile('file') file: Express.Multer.File, @Req() req: any) {
	  const uploadResult = await this.awsService.uploadFile(file.buffer, 'pongus-schlongus', file.originalname, req.user.intra_id);
	
	  // Return the URL of the uploaded file
	  return { url: uploadResult.Location };
	}
}
