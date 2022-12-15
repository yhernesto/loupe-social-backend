// https://googleapis.dev/nodejs/storage/latest/Storage.html
import { Injectable } from '@nestjs/common';
import path from 'path';
import { executeAsyncCommand } from 'src/shared/utils/Utils';
import { Storage } from '@google-cloud/storage';
import { ConfigService } from '@nestjs/config';
import {v4 as uuidv4} from 'uuid';

@Injectable()
export class CloudStorageService {
  
  constructor(private configService: ConfigService){}

  async storeFile_gsutil(command: string): Promise<void>{
    try{
      if(command?.length > 0){
        await executeAsyncCommand(command)
      }
    }catch(e){
      throw e
    }
  }

  async uploadFile(file: Express.Multer.File) {
    const gc = new Storage({
      keyFilename: path.join(__dirname, this.configService.get<string>('GCS_PATH_KEY')),
      projectId: this.configService.get<string>('GCS_PROJECT_ID')
    });
    const bucket = gc.bucket(this.configService.get<string>('GCS_STORAGE_MEDIA_BUCKET'));
    bucket.upload(file.path, { destination: file.filename })
  }
}