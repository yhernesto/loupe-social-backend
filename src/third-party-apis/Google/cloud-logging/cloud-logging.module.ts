import { Module } from '@nestjs/common';
import { CloudLoggingService } from './cloud-logging.service';

@Module({
  providers: [CloudLoggingService],
  exports: [CloudLoggingService]
})
export class CloudLoggingModule {}
