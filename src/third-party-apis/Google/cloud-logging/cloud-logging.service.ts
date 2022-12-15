import { Injectable, Scope } from '@nestjs/common';
import { Logging } from '@google-cloud/logging';
import { CLOUD_LOGGING_SEVERITY } from '../constants/constants';
//https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry#httprequest/


@Injectable({ scope: Scope.TRANSIENT })
export class CloudLoggingService {
  private logging: any
  private context: string
  
  constructor(){
    const projectId = 'sentimen-analyzer'
    this.logging = new Logging({projectId});
  }

  setContext(context: string): void{
    this.context = context
  }

  async log(logName: string, message: string, payLoad?: any): Promise<void>{
    if(payLoad){
      await this.writeMessageWithPayload(logName, CLOUD_LOGGING_SEVERITY.DEFAULT, message, payLoad)
    }else{
      await this.writeMessage(logName, CLOUD_LOGGING_SEVERITY.DEFAULT, message)
    }
  }

  async info(logName: string, message: string, payLoad?: any): Promise<void>{
    if(payLoad){
      await this.writeMessageWithPayload(logName, CLOUD_LOGGING_SEVERITY.INFO, message, payLoad)
    }else{
      await this.writeMessage(logName, CLOUD_LOGGING_SEVERITY.INFO, message)
    }
  }

  async warn(logName: string, message: string, payLoad?: any): Promise<void>{
    if(payLoad){
      await this.writeMessageWithPayload(logName, CLOUD_LOGGING_SEVERITY.WARNING, message, payLoad)
    }else{
      await this.writeMessage(logName, CLOUD_LOGGING_SEVERITY.WARNING, message)
    }
  }

  async error(logName: string, message: string, payLoad?: any): Promise<void>{
    if(payLoad){
      await this.writeMessageWithPayload(logName, CLOUD_LOGGING_SEVERITY.ERROR, message, payLoad)
    }else{
      await this.writeMessage(logName, CLOUD_LOGGING_SEVERITY.ERROR, message)
    }
  }

  async notice(logName: string, message: string, payLoad?: any): Promise<void>{
    if(payLoad){
      await this.writeMessageWithPayload(logName, CLOUD_LOGGING_SEVERITY.NOTICE, message, payLoad)
    }else{
      await this.writeMessage(logName, CLOUD_LOGGING_SEVERITY.NOTICE, message)
    }
  }

  async writeHTTPMessage(reqMethod: string, message: string, reqUrl: string, status_param: number, latency: string, userAgent: string, responseSize: number): Promise<void> {
    const log = this.logging.log('HTTP');

    const metadata = {
      resource: {type: 'global'},
      httpRequest: {
        requestMethod: reqMethod,
        requestUrl: reqUrl,
        status: status_param,
        userAgent: userAgent,
        latency: latency,
        responseSize: responseSize,
      }
    };
    
    const entry = log.entry(metadata, message);
    try{
      async function writeLog() {
        await log.write(entry);
      }
      writeLog();
    }catch(err){ throw err }
  }


  /******************* PRIVATE FUNCTIONS **********************/

  private async writeMessage(logName: string, severity: string, msg: string): Promise<void>{
    const log = this.logging.log(logName);
    const metadata = {
      resource: {type: 'global'},
      labels: { context: this.context },
      severity: severity
    };

    const entry = log.entry(metadata, msg);
    await log.write(entry);
  }

  private async writeMessageWithPayload(logName: string, severity: string, msg: string, payLoad: any): Promise<void>{
    const log = this.logging.log(logName);
    const text_entry = log.entry(msg);
    const metadata = {
      severity: severity,
      labels: {
        context: this.context,
      },
      resource: {  // https://cloud.google.com/logging/docs/reference/v2/rest/v2/MonitoredResource
        type: 'global', 
      },
    };

    const json_Entry = log.entry(metadata, payLoad);
    await log.write([text_entry, json_Entry]);
  }

}
