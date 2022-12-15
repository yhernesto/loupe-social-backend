import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { ApiHandlerModule } from '../api-handler/api-handler.module'
import { DatabaseModule } from 'src/shared/modules/database/database.module';
import { db_ProfileService } from 'src/shared/modules/database/db_profile.service';
import { SentimentService } from 'src/third-party-apis/Google/Sentiment/Sentiment.service';
import { CloudStorageService } from 'src/third-party-apis/Google/cloud-storage/cloud-storage.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [ApiHandlerModule, DatabaseModule, ConfigService],
  providers: [ProfileService, db_ProfileService, SentimentService, CloudStorageService],
  controllers: [ProfileController],
  exports: [ProfileService]
})
export class ProfileModule {}

