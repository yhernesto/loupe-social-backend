import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/shared/modules/database/database.module';
import { CloudLoggingModule } from 'src/third-party-apis/Google/cloud-logging/cloud-logging.module';
import { CloudLoggingService } from 'src/third-party-apis/Google/cloud-logging/cloud-logging.service';
import { CloudStorageModule } from 'src/third-party-apis/Google/cloud-storage/cloud-storage.module';
import { SentimentModule } from 'src/third-party-apis/Google/Sentiment/Sentiment.module';
import { UsersModule } from 'src/users/users.module';
import { ApiHandlerModule } from './api-handler/api-handler.module';
import { HashtagModule } from './hashtag/hashtag.module';
import { HashtagService } from './hashtag/hashtag.service';
import { InstagramService } from './instagram.service';
import { ProfileModule } from './profile/profile.module';
import { ProfileService } from './profile/profile.service';

@Module({
  imports: [HashtagModule, ProfileModule, UsersModule, ApiHandlerModule, DatabaseModule, 
    SentimentModule, CloudStorageModule, CloudLoggingModule],
  providers: [InstagramService, HashtagService, ProfileService, UsersModule, CloudLoggingService],
  exports: [InstagramService]
})
export class InstagramModule {}
