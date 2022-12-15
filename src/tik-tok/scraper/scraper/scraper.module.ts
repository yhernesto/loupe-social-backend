import { Module } from '@nestjs/common';
import { ScraperController } from './scraper.controller';
import { Tt_postModule } from '../../modules/tt_post.module';

@Module({
  imports: [Tt_postModule],
  controllers: [ScraperController]
})
export class ScraperModule {}
