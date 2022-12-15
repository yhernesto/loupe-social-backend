import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AppLoggerModule } from 'src/shared/modules/app-logger/app-logger.module';
import { DatabaseModule } from 'src/shared/modules/database/database.module';
import { Db_HashtagService } from 'src/shared/modules/database/db_hashtag.service';
import { HashtagController } from './hashtag.controller';
import { HashtagService } from './hashtag.service';

@Module({
  imports: [DatabaseModule, AppLoggerModule],
  providers: [HashtagService, Db_HashtagService
    // {provide: APP_GUARD, useClass: JwtAuthGuard}   //commented until protect all EP be needed
  ],
  controllers: [HashtagController],
})
export class HashtagModule {}
