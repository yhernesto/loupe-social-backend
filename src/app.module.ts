import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScraperModule } from './tik-tok/scraper/scraper/scraper.module';
import { HashtagModule } from './instagram/hashtag/hashtag.module';
import { ApiHandlerModule } from './instagram/api-handler/api-handler.module'
import { DatabaseModule } from './shared/modules/database/database.module'
import { ProfileModule } from  './instagram/profile/profile.module'
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './api/auth/auth.module';
import { SentimentModule } from './third-party-apis/Google/Sentiment/Sentiment.module';
import { WebFeedsModule } from './api/webFeeds/webFeeds.module';
import { ProfileModule as API_profileModule } from './api/instagram/profile/profile.module';
import { HashtagModule as API_hashtagModule } from './api/instagram/hashtag/hashtag.module';
import { DatabaseService } from './shared/modules/database/database.service';
import { CloudStorageModule } from './third-party-apis/Google/cloud-storage/cloud-storage.module';
import { ScheduleModule } from '@nestjs/schedule';
import { InstagramModule } from './instagram/instagram.module';
import { InstagramService } from './instagram/instagram.service';
import { AppLoggerModule } from './shared/modules/app-logger/app-logger.module';
import { AppLoggerService } from './shared/modules/app-logger/app-logger.service';
import { CloudLoggingModule } from './third-party-apis/Google/cloud-logging/cloud-logging.module';
import { CloudLoggingService } from './third-party-apis/Google/cloud-logging/cloud-logging.service';
import { SystemModule } from './shared/modules/system/system.module';
import { ConfigService } from '@nestjs/config';
import { FacebookModule } from './facebook/facebook.module';

@Module({
  //imports: [ScraperModule, MongooseModule.forRoot('mongodb+srv://appeiron_manager:9Eo6wDYkCoHkVpqK@trendsanalyser.17ftj.mongodb.net/test')],
  imports: [
    ScraperModule, HashtagModule, ProfileModule, ApiHandlerModule, DatabaseModule, WebFeedsModule, API_profileModule, API_hashtagModule,
    ConfigModule.forRoot({isGlobal: true}),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_DB'),
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    UsersModule,
    AuthModule,
    SentimentModule,
    CloudStorageModule,
    CloudLoggingModule,
    InstagramModule,
    AppLoggerModule,
    SystemModule,
    FacebookModule
  ],
  controllers: [AppController],
  providers: [AppService, DatabaseService, InstagramService, AppLoggerService, CloudLoggingService],
})

export class AppModule {}
