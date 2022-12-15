import { CacheModule, Module } from '@nestjs/common';
import { NewsService } from 'src/third-party-apis/Google/news/news.service';
import { WebFeedsController } from './webFeeds.controller';
import { WebFeedsService } from './webFeeds.service';
import { DatabaseService } from 'src/shared/modules/database/database.service';
import { Countries, DatabaseModule } from 'src/shared/modules/database/database.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CACHE_EXPIRATION_TIME } from 'src/third-party-apis/Google/constants/constants';


@Module({
  imports: [DatabaseModule, CacheModule.register({ttl: CACHE_EXPIRATION_TIME, max: 100})],
  controllers: [WebFeedsController],
  providers: [WebFeedsService, NewsService, DatabaseService, Countries,
    {
      provide: 'WEB_FEEDS_TOPICS',
      useFactory: async (DatabaseService) => await DatabaseService.getWebFeeds_topics(), 
      inject: [DatabaseService]
    },
    {
      provide: 'WEB_FEEDS_COUNTRY_LANG',
      useFactory: async (DatabaseService) => await DatabaseService.getWebFeeds_countryLang(), 
      inject: [DatabaseService]
    },
    {
      provide: 'WEB_FEEDS_COUNTRY_LANGUAGES',
      useFactory: async (DatabaseService) => await DatabaseService.getWebFeeds_countryLanguages(), 
      inject: [DatabaseService]
    },
    // {provide: APP_GUARD, useClass: JwtAuthGuard}
  ]
})
export class WebFeedsModule {}
