import { Injectable } from '@nestjs/common';
import { InstagramService } from 'src/instagram/instagram.service';
import { ProfileService } from 'src/instagram/profile/profile.service';
import { ExecutionState } from 'src/shared/constants/constants';
import { asyncForEach, delay } from 'src/shared/utils/Utils';
import { IClient } from 'src/users/database/interface/Client.intf';
import { UsersService } from 'src/users/users.service';
import { AppLoggerService } from '../app-logger/app-logger.service';
import { DatabaseService } from '../database/database.service';
import { ISys_executionLog } from '../database/interfaces/System/Sys_executionLog.intf';

@Injectable()
export class SystemService {
  private readonly appLogger = new AppLoggerService(SystemService.name)
  constructor(
    private usersService: UsersService, private databaseService: DatabaseService, 
    private instagramService: InstagramService, 
    // private profileService: ProfileService, 
  ){}
 
  async loadProfilesData(): Promise<void>{
    try{
      const clients = await this.usersService.findClients()
      this.appLogger.info(this.loadProfilesData.name, 'clients found: ' + (clients?.length || 'null'))
      await asyncForEach(clients, async (client: IClient) => {
        this.appLogger.info(this.loadProfilesData.name, 'ForEach - In client: ' + client.name)
        const lastExecution = await this.databaseService.lastSysProfileLog(client)
        const isTimeToCall = this.timeToCall(lastExecution, client)
        let timesInDay = this.newTimesInDay(lastExecution)
        if(isTimeToCall){
          const state = await this.instagramService.loadProfileData(client)
          if(state != ExecutionState.OK) timesInDay = timesInDay - 1
          await this.databaseService.createSysProfileLog({ client: client._id, execution_state: state, timesInDay: timesInDay })
        }
        await delay(3000)
      })
    }catch(err){
      this.appLogger.error(this.loadProfilesData.name, 'throwing error: ', err)
      throw err
    }
  }

  async loadProfilesPostsData(): Promise<void>{
    try{
      const clients = await this.usersService.findClients()
      this.appLogger.info(this.loadProfilesData.name, 'clients found: ' + (clients?.length || 'null'))
      await asyncForEach(clients, async (client: IClient) => {
        this.appLogger.info(this.loadProfilesData.name, 'ForEach - In client: ' + client.name)
        const lastExecution = await this.databaseService.lastSysProfilePostsLog(client)
        const isTimeToCall = this.timeToCall(lastExecution, client)
        let timesInDay = this.newTimesInDay(lastExecution)
        console.log('times in day: ' + timesInDay)
        if(isTimeToCall && (timesInDay <= client.plan.profile_posts)){
          const [state, newPosts] = await this.instagramService.loadProfilePostsData(client)
          if(state != ExecutionState.OK) timesInDay = timesInDay - 1
          const _newPosts = timesInDay > 0 ? newPosts + lastExecution.processedItems : newPosts
          await this.databaseService.createSysProfilePostsLog({ client: client._id, execution_state: state, processedItems: _newPosts, timesInDay: timesInDay })
        }
        await delay(3000)
      })
    }catch(err){
      this.appLogger.error(this.loadProfilesData.name, 'throwing error: ', err)
      throw err
    }
  }

  async loadTagPostsData(): Promise<void>{
    try{
      const clients = await this.usersService.findClients()
      this.appLogger.info(this.loadTagPostsData.name, 'clients found: ' + (clients?.length || 'null'))
      await asyncForEach(clients, async (client: IClient) => {
        this.appLogger.info(this.loadTagPostsData.name, 'ForEach - In client: ' + client.name)
        const lastExecution = await this.databaseService.lastSysTagPostsLog(client)
        const isTimeToCall = this.timeToCall(lastExecution, client)
        let timesInDay = this.newTimesInDay(lastExecution)
        console.log('times in day: ' + timesInDay)
        if(isTimeToCall && (timesInDay <= client.plan.tag_posts)){
          const [state, newPosts] = await this.instagramService.loadTagPostsData(client)
          if(state != ExecutionState.OK) timesInDay = timesInDay - 1
          const _newPosts = timesInDay > 0 ? newPosts + lastExecution.processedItems : newPosts
          await this.databaseService.createSysTagPostsLog({ client: client._id, execution_state: state, processedItems: _newPosts, timesInDay: timesInDay })
        }
        await delay(3000)
      })
    }catch(err){
      this.appLogger.error(this.loadTagPostsData.name, 'throwing error: ', err)
      throw err
    }
  }
  
  async ProfileCommentsData(): Promise<void>{
    try{
      const clients = await this.usersService.findClients()
      this.appLogger.info(this.ProfileCommentsData.name, 'clients found: ' + (clients?.length || 'null'))
      await asyncForEach(clients, async (client: IClient) => {
        this.appLogger.info(this.ProfileCommentsData.name, 'ForEach - In client: ' + client.name)
        const lastExecution = await this.databaseService.lastSysProfileCommentsLog(client)
        const isTimeToCall = this.timeToCall(lastExecution, client)
        let timesInDay = this.newTimesInDay(lastExecution)
        console.log('times in day: ' + timesInDay)
        if(isTimeToCall && (timesInDay <= client.plan.profile_comments)){
          const [state, newComments] = await this.instagramService.loadProfileCommentsData(client, 10, lastExecution)
          if(state != ExecutionState.OK) timesInDay = timesInDay - 1
          const _newComments = timesInDay > 0 ? newComments + lastExecution.processedItems : newComments
          await this.databaseService.createSysProfileCommentsLog({ client: client._id, execution_state: state, processedItems: _newComments, timesInDay: timesInDay })
        }
        await delay(3000)
      })
    }catch(err){
      this.appLogger.error(this.ProfileCommentsData.name, 'throwing error: ', err)
      throw err
    }
  }

  async loadHashtagsPostsData(): Promise<void>{
    try{
      const clients = await this.usersService.findClients()
      this.appLogger.info(this.loadProfilesData.name, 'clients found: ' + (clients?.length || 'null'))
      await asyncForEach(clients, async (client: IClient) => {
        this.appLogger.info(this.loadProfilesData.name, 'ForEach - In client: ' + client.name)
        const lastExecution = await this.databaseService.lastSysHashtagPostsLog(client)
        const isTimeToCall = this.timeToCall(lastExecution, client)
        let timesInDay = this.newTimesInDay(lastExecution)
        console.log('times in day' + timesInDay)
        if(isTimeToCall && (timesInDay <= client.plan.profile_posts)){
          const [state, newPosts] = await this.instagramService.loadHashtagsData(client)
          if(state != ExecutionState.OK) timesInDay = timesInDay - 1
          const _newPosts = timesInDay > 0 ? newPosts + lastExecution.processedItems : newPosts
          await this.databaseService.createSysHashtagPostsLog({ client: client._id, execution_state: state, processedItems: _newPosts, timesInDay: timesInDay })
        }
        await delay(3000)
      })
    }catch(err){
      this.appLogger.error(this.loadHashtagsPostsData.name, 'throwing error: ', err)
      throw err
    }
  }

  async InfluencerProfileData(): Promise<void>{
    try{
      const clients = await this.usersService.findClients()
      this.appLogger.info(this.InfluencerProfileData.name, 'clients found: ' + (clients?.length || 'null'))
      await asyncForEach(clients, async (client: IClient) => {
        this.appLogger.info(this.InfluencerProfileData.name, 'ForEach - In client: ' + client.name)
        await this.instagramService.InfluencerProfileData({client: client, onlyNews: true})
        await delay(5000)
      })
    }catch(err){
      this.appLogger.error(this.loadHashtagsPostsData.name, 'throwing error: ', err)
      throw err
    }
  }

  /** ********************************************************************************************************** **/
  /** **************************************** PRIVATE FUNCTIONS *********************************************** **/

  private timeToCall(lastExecution: ISys_executionLog, client: IClient): boolean {
    let timeToCall = false
    if(lastExecution.execution_state !== ExecutionState.OK || !lastExecution.timestamp){
      timeToCall = true
    }else{
      const currentTime = new Date().getTime()
      const sinceLastExec = (currentTime - lastExecution.timestamp)/60000
      const execTimeInterval = 1440/client.plan.times   //interval in minutes
      this.appLogger.info(this.timeToCall.name, 'last execution for client was: ' + sinceLastExec + ' minutes ago')
      if(sinceLastExec >= execTimeInterval){
        timeToCall = true 
      }
    }
    return timeToCall
  }

  private newTimesInDay(lastExecution: ISys_executionLog): number {
    if(lastExecution.timestamp){
      const current = new Date()
      const lastExec = new Date(lastExecution.timestamp)
      const diffDays = current.getUTCDate() - lastExec.getUTCDate()
      if(diffDays > 0){
        this.appLogger.info(this.newTimesInDay.name, 'times in day goes to 0 because is a new day')
        return 1
      }else{
        return lastExecution.timesInDay + 1
      }
    }else{
      return 0
    }
  }

}
