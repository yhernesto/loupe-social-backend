import { Module } from '@nestjs/common';
import { FacebookApiHandlerModule } from './api-handler/api-handler.module';
import { FacebookService } from './facebook.service';

@Module({
  imports: [FacebookApiHandlerModule],
  controllers: [],
  providers: [FacebookService],
  exports: [FacebookService]
})
export class FacebookModule {}
