// source: https://refactoring.guru/design-patterns/chain-of-responsibility/typescript/example
import { HttpService } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProfileResponseDTO } from './interfaces/dtos/ProfileResponse.dto'
import { HashtagResponseDTO } from './interfaces/dtos/HashtagResponse.dto'
import { ProfilePostsResponseDTO } from './interfaces/dtos/ProfilePostsResponse.dto';
import { IPostCommentsResponse } from './interfaces/dtos/PostCommentsResponse.dto';

@Injectable()
export abstract class AbstractHandler implements Handler{
  private nextHandler: Handler

  constructor(public httpService: HttpService, public configService: ConfigService){}

  public setNext(handler: Handler): Handler {
    this.nextHandler = handler
    return this.nextHandler
  }

  public async getHashtagData(hashtag: string): Promise<HashtagResponseDTO> {
    if(this.nextHandler){
      return this.nextHandler.getHashtagData(hashtag)
    }
    return JSON.parse('fuck off')
  }

  public async getProfileData(user_id: number, username: string): Promise<ProfileResponseDTO> {
    if(this.nextHandler){
      return this.nextHandler.getProfileData(user_id, username)
    }
    return JSON.parse('fuck off')
  }

  public async getProfilePostsData(username: string): Promise<ProfilePostsResponseDTO>{
    if(this.nextHandler){
      return this.nextHandler.getProfilePostsData(username)
    }
    return JSON.parse('fuck off')
  }
  
  public async getProfileFeedData(callsCounter: number, username: string): Promise<ProfilePostsResponseDTO[]>{
    if(this.nextHandler){
      return this.nextHandler.getProfileFeedData(callsCounter, username)
    }
    return JSON.parse('fuck off')
  }  

  public async   getProfileCommentsData(mediaId: string): Promise<IPostCommentsResponse>{
    if(this.nextHandler){
      return this.nextHandler.getProfileCommentsData(mediaId)
    }
    return JSON.parse('fuck off')
  }
}