import { Injectable } from '@nestjs/common';
import { PsadbroHandler } from '../api-handler/concrete-handlers/Psadbro.handler'
import { KirtanHandler } from './concrete-handlers/Kirtan.handler'
import { HashtagResponseDTO } from './interfaces/dtos/HashtagResponse.dto'
import { ProfileResponseDTO } from './interfaces/dtos/ProfileResponse.dto'
import { ProfilePostsResponseDTO } from './interfaces/dtos/ProfilePostsResponse.dto'
import { AppLoggerService } from 'src/shared/modules/app-logger/app-logger.service';
import { IPostCommentsResponse } from './interfaces/dtos/PostCommentsResponse.dto';
import { TagResponseDTO } from './interfaces/dtos/Kirtan/KirtanTagResponse.dto';

@Injectable()
export class ApiHandlerService {
  private readonly appLogger = new AppLoggerService(ApiHandlerService.name)

  constructor(
    // private psadbroHandler: PsadbroHandler, private yuananfHandler: KirtanHandler
    private kirtanHandler: KirtanHandler, private psadbroHandler: PsadbroHandler
  ){
    this.psadbroHandler.setNext(this.kirtanHandler)
  }

  async getHashtagData(hashtagName: string): Promise<HashtagResponseDTO> {
    try{
      const hashtagResponsePost: HashtagResponseDTO = await this.kirtanHandler.getHashtagData(hashtagName)
      this.appLogger.notice('RapidApiResponse', 'HashtagData parsed response: ', hashtagResponsePost)
      return hashtagResponsePost
    }catch(err){
      throw err
    }
  }

  async getProfileData(user_id: number, username: string): Promise<ProfileResponseDTO> {
    try{
      const profileResponse: ProfileResponseDTO = await this.kirtanHandler.getProfileData(user_id, username)
      this.appLogger.notice('RapidApiResponse', 'ProfileData parsed response: ', profileResponse)
      return profileResponse
    }catch(err){
      throw err
    }
  }

  async getProfilePostsData(username: string): Promise<ProfilePostsResponseDTO> {
    try{
      const profilePostsResponse: ProfilePostsResponseDTO = await this.kirtanHandler.getProfilePostsData(username)
      this.appLogger.notice('RapidApiResponse', 'ProfilePostsData parsed response: ', 'object')
      return profilePostsResponse
    }catch(err){
      throw err
    }
  }

  async getTagPostsData(username: string): Promise<TagResponseDTO> {
    try{
      const tagPostsResponse: TagResponseDTO = await this.kirtanHandler.getTagPostsData(username)
      this.appLogger.notice('RapidApiResponse', 'getTagPostsData parsed response: ', 'object')
      return tagPostsResponse
    }catch(err){ throw err }
  }

  async getProfileFeedData(callsCounter: number, username: string): Promise<ProfilePostsResponseDTO[]> {
    try{
      const profileFeedResponse: ProfilePostsResponseDTO[] = await this.kirtanHandler.getProfileFeedData(callsCounter, username)
      this.appLogger.notice('RapidApiResponse', 'ProfilePostsData parsed response: ', 'object')
      return profileFeedResponse
    }catch(err){
      throw err
    }
  }
  
  async getProfileCommentsData(mediaId: string): Promise<IPostCommentsResponse> {
    try{
      const profileFeedResponse: IPostCommentsResponse = await this.kirtanHandler.getProfileCommentsData(mediaId)
      this.appLogger.notice('RapidApiResponse', 'ProfilePostsData parsed response: ', 'object')
      return profileFeedResponse
    }catch(err){
      throw err
    }
  }
}
