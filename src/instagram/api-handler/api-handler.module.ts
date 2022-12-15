import { Module } from '@nestjs/common';
import { ApiHandlerService } from './api-handler.service';
import { HttpModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PsadbroHandler } from '../api-handler/concrete-handlers/Psadbro.handler';
import { KirtanHandler } from './concrete-handlers/Kirtan.handler';
import { CloudLoggingModule } from 'src/third-party-apis/Google/cloud-logging/cloud-logging.module';
import { CloudLoggingService } from 'src/third-party-apis/Google/cloud-logging/cloud-logging.service';

@Module({
  imports: [HttpModule, ConfigService, CloudLoggingModule],
  providers: [ApiHandlerService, PsadbroHandler, KirtanHandler, CloudLoggingService],
  exports: [ApiHandlerService, PsadbroHandler, KirtanHandler]
})
export class ApiHandlerModule {}
