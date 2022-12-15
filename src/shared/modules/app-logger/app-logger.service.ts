import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { CloudLoggingService } from 'src/third-party-apis/Google/cloud-logging/cloud-logging.service';

@Injectable()
export class AppLoggerService extends Logger {
  private readonly sendToCloudLogging = false
  private cloudLogger: CloudLoggingService

  constructor(context: string){
    super(context)
    this.cloudLogger = new CloudLoggingService()
    this.cloudLogger.setContext(context)
  }
  
  log(logName: string, message: string) {
    if(this.sendToCloudLogging) this.cloudLogger.log(logName, message)
    super.log(message);
  }

  info(logName: string, message: string, payLoad?: any){
    if(this.sendToCloudLogging) this.cloudLogger.info(logName, message, payLoad)
    message = payLoad ? message + '\n' + payLoad : message
    super.log(message)
  }

  notice(logName: string, message: string, payLoad?: any) {
    if(this.sendToCloudLogging) this.cloudLogger.notice(logName, message, payLoad)
    message = payLoad ? message + '\n' + payLoad : message
    super.log(message);
  }

  warn(message: string, logName: string) {
    if(this.sendToCloudLogging) this.cloudLogger.warn(logName, message)
    super.warn(message);
  }

  error(message: string, trace: string, logName: string) {
    if(this.sendToCloudLogging) this.cloudLogger.error(logName, message, trace)
    super.error(message, trace);
  }

  httpLogging(reqMethod: string, message: string, reqUrl: string, status: number, latency_n: number, userAgent: string, responseSize: number) {
    const latency = (latency_n/1000).toString()
    if(this.sendToCloudLogging) this.cloudLogger.writeHTTPMessage(reqMethod, message, reqUrl, status, latency, userAgent, responseSize)
    
    const httpLog = {
      logName: 'HTTP',
      reqMethod: reqMethod,
      reqUrl: reqUrl,
      status: status,
      latency: latency,
      userAgent: userAgent,
      responseSize: responseSize
    }

    super.log('http response log: \n' + JSON.stringify(httpLog))
  }
}