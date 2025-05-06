import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class UploadToAwsProvider {
  constructor(
    /**
     * Inject configService
     */
    private readonly configService: ConfigService,
  ) {}

  public async fileUpload(file: Express.Multer.File) {
    const s3 = new S3();

    try {
      const uploadresult = await s3
        .upload({
          Bucket:
            this.configService.get<string>('appConfig.awsBucketName') ?? '',
          Body: file.buffer,
          Key: this.generateFileName(file),
          ContentType: file.mimetype,
        })
        .promise();

      return uploadresult.Key;
    } catch (error) {
      throw new RequestTimeoutException(error);
    }
  }

  private generateFileName(file: Express.Multer.File): string {
    // Extract file name
    let name = file.originalname.split('.')[0];
    // Remove white spaces
    name = name.replace(/\s/g, '');
    // Extract the file extension
    const extension = path.extname(file.originalname);
    // Generate timestamp
    const timestamp = new Date().getTime().toString().trim();
    // Return file uuid
    return `${name}-${timestamp}-${uuidv4()}${extension}`;
  }
}
