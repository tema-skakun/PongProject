import { Controller, Post, UploadedFile, Get, Put, Req, UseInterceptors, UseGuards, Res } from '@nestjs/common';
import { AwsService } from './aws.service';
import { inspect } from 'util';
import { FileInterceptor } from '@nestjs/platform-express';
import JwtTwoFactorGuard from 'src/GuardStrategies/Jwt2F.guard';
import { BadRequestException } from '@nestjs/common';

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
	  if (!file)
	  {
		throw new BadRequestException('no file was provided');
	  }
	  if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg')
	  {
		throw new BadRequestException('file needs to be an image')
	  }

	  const uploadResult = await this.awsService.uploadFile(file.buffer, 'pongus-schlongus', file.originalname, req.user.intra_id);
	
	  // Return the URL of the uploaded file
	  return { url: uploadResult.Location };
	}
}
