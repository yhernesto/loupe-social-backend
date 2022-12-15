import { Module } from '@nestjs/common';
import { CloudLoggingModule } from 'src/third-party-apis/Google/cloud-logging/cloud-logging.module';
import { CloudLoggingService } from 'src/third-party-apis/Google/cloud-logging/cloud-logging.service';
import { AppLoggerService } from './app-logger.service';

@Module({
  imports : [CloudLoggingModule],
  providers: [AppLoggerService, CloudLoggingService],
  exports: [AppLoggerService, CloudLoggingService]
})
export class AppLoggerModule {}
