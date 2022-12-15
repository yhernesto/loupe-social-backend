import { CacheModule, Module } from '@nestjs/common';
import { CACHE_EXPIRATION_TIME } from '../constants/constants';
import { NewsService } from './news.service';

@Module({
  imports: [CacheModule.register({ttl: CACHE_EXPIRATION_TIME, max: 100})],
  providers: [NewsService],
  exports: [NewsService]
})
export class NewsModule {}
