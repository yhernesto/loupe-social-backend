import { Module } from '@nestjs/common';
import { HashtagController } from './hashtag.controller';
import { HashtagService } from './hashtag.service';
import { ApiHandlerModule } from '../api-handler/api-handler.module';
import { DatabaseModule } from '../../shared/modules/database/database.module'
import { SentimentService } from 'src/third-party-apis/Google/Sentiment/Sentiment.service';
import { Db_HashtagService } from 'src/shared/modules/database/db_hashtag.service';
import { AppLoggerModule } from 'src/shared/modules/app-logger/app-logger.module';
import { AppLoggerService } from 'src/shared/modules/app-logger/app-logger.service';
import { ConfigService } from '@nestjs/config';
import { CloudStorageService } from 'src/third-party-apis/Google/cloud-storage/cloud-storage.service';
import { DatabaseService } from 'src/shared/modules/database/database.service';

@Module({
  imports: [ApiHandlerModule, DatabaseModule, AppLoggerModule, ConfigService ],
  providers: [HashtagService, SentimentService, Db_HashtagService, DatabaseService, AppLoggerService, CloudStorageService],
  controllers: [HashtagController],
  exports: [HashtagService]
})
export class HashtagModule {}
