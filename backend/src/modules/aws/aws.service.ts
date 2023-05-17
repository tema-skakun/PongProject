import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { UserService } from '../user/user.service';


@Injectable()
export class AwsService {
	private readonly s3;

	constructor(
		private userService: UserService
	) {
		this.s3 = new AWS.S3({
			accessKeyId: process.env.AWS_ACCESS_KEY_ID,
			secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
			region: process.env.AWS_REGION,
		})
	}

	async uploadFile(file: Buffer, bucket: string, key: string, intraId: number): Promise<AWS.S3.ManagedUpload.SendData> {
		const params = {
		  Bucket: bucket,
		  Key: key,
		  Body: file
		};
	  
		const uploadResult = await this.s3.upload(params).promise();
		if (uploadResult.Location)
			this.userService.updatePic(intraId, uploadResult.Location);
		
		return uploadResult;
	  }
	  
}
