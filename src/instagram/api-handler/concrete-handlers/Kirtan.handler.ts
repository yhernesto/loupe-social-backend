import  * as fs  from 'fs';
import { RapidApi } from '../../../shared/constants/instagram.constants'
import { AbstractHandler } from '../handler.abstract';
import { AppLoggerService } from 'src/shared/modules/app-logger/app-logger.service';
import { KirtanApiParams, KirtanFeedQueryParams, KirtanHashtagPostsQueryParams, KirtanProfileCommentsQueryParams, KirtanProfileQueryParams, KirtanTagPostsQueryParams } from '../interfaces/kirtan-api.interface';
import { IKirtanProfileResponse } from '../interfaces/dtos/Kirtan/KirtanProfileResponse.dto';
import { profileINTFfromKirtanRes, ProfileResponseDTO } from '../interfaces/dtos/ProfileResponse.dto';
import { hashtagPostsINTFfromKirtanRes, HashtagResponseDTO } from '../interfaces/dtos/HashtagResponse.dto';
import { IHashtagResponse } from '../interfaces/dtos/Kirtan/KirtanHashtagResponse.dto';
import { profilePostINTFfromKirtanFeedRes, profilePostINTFfromKirtanRes, ProfilePostsResponseDTO } from '../interfaces/dtos/ProfilePostsResponse.dto';
import { IKirtanFeedResponse } from '../interfaces/dtos/Kirtan/KirtanFeedResponse.dto';
import { IPostCommentsResponse } from '../interfaces/dtos/PostCommentsResponse.dto';
import { TagResponseDTO } from '../interfaces/dtos/Kirtan/KirtanTagResponse.dto';

export class KirtanHandler extends AbstractHandler{
  private readonly appLogger = new AppLoggerService(KirtanHandler.name)

  // ------------------------ Hashtag ---------------------------- //
  public async getHashtagData(hashtagName: string): Promise<HashtagResponseDTO>{
    const endpointName = RapidApi.KIRTAN.HASHTAG.ENDPOINT_NAME
    const endpointUrl: string = this.buildEndpoint({endpoint_name: endpointName})
    try{
      if(true){
        const hashtagTopPostsQueryParams: KirtanHashtagPostsQueryParams = {tag: hashtagName, feed_type: 'top', corsEnabled: false}
        const kirtanTopApiParams: KirtanApiParams = {endpointUrl: endpointUrl, params: hashtagTopPostsQueryParams}
        const topResponse = await this.getDataFromApi(kirtanTopApiParams, 'kirtan_hashtagData')
        
        const hashtagFeedPostsQueryParams: KirtanHashtagPostsQueryParams = {tag: hashtagName, feed_type: 'recent', corsEnabled: false}
        const kirtanFeedApiParams: KirtanApiParams = {endpointUrl: endpointUrl, params: hashtagFeedPostsQueryParams}
        const feedResponse = await this.getDataFromApi(kirtanFeedApiParams, 'kirtan_hashtagData')
        if(topResponse || feedResponse){
          const kirtanHashtagTopResp = <IHashtagResponse>(topResponse as unknown)
          const kirtanHashtagFeedResp = <IHashtagResponse>(feedResponse as unknown)
          const hashtagTopResponseINTF = hashtagPostsINTFfromKirtanRes(hashtagName, kirtanHashtagTopResp, kirtanHashtagFeedResp)
          return new HashtagResponseDTO(hashtagTopResponseINTF)
        }
        return null
      }
      return super.getHashtagData(hashtagName)
    }catch(err){
      console.info(err)
      throw err
    }
  }

  // ---------------------- Profile ------------------------------ //
  public async getProfileData(user_id: number, username: string): Promise<ProfileResponseDTO>{
    const endpointName = RapidApi.KIRTAN.PROFILE.USER_INFO_EP_NAME
    const endpointUrl: string = this.buildEndpoint({endpoint_name: endpointName})
    try{
      if(true){
        const profileQueryParams: KirtanProfileQueryParams = {response_type: 'short', ig: user_id, corsEnabled: 'false'}
        const kirtanApiParams: KirtanApiParams = {endpointUrl: endpointUrl, params: profileQueryParams}
        const response = await this.getDataFromApi(kirtanApiParams, 'kirtan_profileData')
        if(response){
          const kirtanProfile_resINTF = <IKirtanProfileResponse>(response as unknown)
          const profile_responseINTF = profileINTFfromKirtanRes(kirtanProfile_resINTF)
          return new ProfileResponseDTO(profile_responseINTF)
        }
        return null
      }
      // return super.getProfileData(user_id)
    }catch(e){ throw e }
  }

  public async getProfilePostsData(username: string): Promise<ProfilePostsResponseDTO>{
    const endpointName = RapidApi.KIRTAN.PROFILE.USER_POSTS_EP_NAME
    const endpointUrl: string = this.buildEndpoint({endpoint_name: endpointName})
    try{
      if(true){
        const profilePostsQueryParams: KirtanProfileQueryParams = {response_type: 'feed', ig: username}
        const kirtanApiParams: KirtanApiParams = {endpointUrl: endpointUrl, params: profilePostsQueryParams}
        const response = await this.getDataFromApi(kirtanApiParams, 'kirtan_profilePostData')
        if(response){
          const kirtanProfilePostsRespINTF = <IKirtanProfileResponse>(response as unknown)
          const profilePostsResponseINTF = profilePostINTFfromKirtanRes(kirtanProfilePostsRespINTF)
          return new ProfilePostsResponseDTO(profilePostsResponseINTF)
        }
        return null
      }
    }catch(err){ throw err }
  }

  public async getTagPostsData(username: string): Promise<TagResponseDTO>{
    const endpointName = RapidApi.KIRTAN.PROFILE.USER_TAGGED_EP_NAME
    const endpointUrl: string = this.buildEndpoint({endpoint_name: endpointName})
    try{
      if(true){
        const tagPostsQueryParams: KirtanTagPostsQueryParams = {ig: username, corsEnabled: 'false'}
        const kirtanApiParams: KirtanApiParams = {endpointUrl: endpointUrl, params: tagPostsQueryParams}
        const response = await this.getDataFromApi(kirtanApiParams, 'kirtan_tagPostData')
        if(response){
          return <TagResponseDTO>(response as unknown)
        }
        return null
      }
    }catch(err){ throw err }
  }

  public async getProfileFeedData(callsCounter: number, username: string): Promise<ProfilePostsResponseDTO[]>{
    const profilePostsResponses: ProfilePostsResponseDTO[] = []
    const endpointName = RapidApi.KIRTAN.PROFILE.USER_FEED_EP_NAME
    const endpointUrl: string = this.buildEndpoint({endpoint_name: endpointName})
    try{
      if(true){
        let nextMaxId = ''
        let posts = 0
        for(let idx = 0; idx < callsCounter; idx++){
          const profilePostsQueryParams: KirtanFeedQueryParams = idx > 0 ? { ig: username, nextMaxId: nextMaxId, corsEnabled: false} : { ig: username, corsEnabled: false}
          const kirtanApiParams: KirtanApiParams = {endpointUrl: endpointUrl, params: profilePostsQueryParams}
          const [profileFeedPosts, _nextMaxId] = await this.getFeedPosts(kirtanApiParams)
          posts = posts + profileFeedPosts.length
          profilePostsResponses.push(...profileFeedPosts)
          nextMaxId = _nextMaxId
        }
        return profilePostsResponses
      }
    }catch(err){ throw err }
  }

  public async getProfileCommentsData(mediaId: string): Promise<IPostCommentsResponse> {
    const endpointName = RapidApi.KIRTAN.PROFILE.USER_COMMENTS_EP_NAME
    const endpointUrl: string = this.buildEndpoint({endpoint_name: endpointName})
    try{
      if(true){
        const profileCommentsQueryParams: KirtanProfileCommentsQueryParams = {corsEnabled: 'false', media_id: mediaId}
        const kirtanApiParams: KirtanApiParams = {endpointUrl: endpointUrl, params: profileCommentsQueryParams}
        const response = await this.getDataFromApi(kirtanApiParams, 'kirtan_profileComments')
        if(response){
          const profileCommentsRespINTF = <IPostCommentsResponse>(response as unknown)
          return profileCommentsRespINTF
        }
        return null
      }
    }catch(err){ throw err }
  }


  // --------------------------------------------------------------------
  // ------------------------- Private Functions ------------------------

  private async getDataFromApi(kirtanApiParams: KirtanApiParams, endpointName: string): Promise<any>{
    const key = this.configService.get<string>('KIRTAN_API_KEY')
    const host = this.configService.get<string>('KIRTAN_API_HOST')
    try{
      this.appLogger.notice(this.getDataFromApi.name, 'calling RapidApi EP: ' + kirtanApiParams.endpointUrl + 
      ', with params: ', JSON.stringify(kirtanApiParams.params))
      const rawResponse = await this.httpService.get(
        kirtanApiParams.endpointUrl,
        {
          headers:{
            "x-rapidapi-key": key,
            "x-rapidapi-host": host, 
            "useQueryString": true
          }, 
          params: kirtanApiParams.params,
        }).toPromise().then(res => res.data)

        const response = rawResponse[0] ? rawResponse[0] : rawResponse
        if(!response || response?.error_code)
          throw new Error('Kirtan API is not returning a properly response: ' + '\n' + 'current response: ' + JSON.stringify(response))

      this.writeFileOutResponse(response, endpointName)
      return response  

      //reading from file
      // const rawdata = fs.readFileSync(__dirname + '/profilePosts.json');
      // return JSON.parse(rawdata.toString())
    }catch(error){
      // console.info(error)
      throw error
    }
  }

  private buildEndpoint(param: {endpoint_name: string}): string {
    return this.configService.get<string>('KIRTAN_API_ENDPOINT') + '/' + param.endpoint_name
  }

  private writeFileOutResponse(data: any, ep_name: string): void {
    const currentTime = new Date()
    const currentTimeStr = currentTime.getFullYear() + '-' + (currentTime.getMonth() + 1) + '-' + currentTime.getDate() + '_' + 
    currentTime.getHours() + '_' + currentTime.getMinutes() + '_' + currentTime.getSeconds()
    fs.writeFile(__dirname + '/' + ep_name + '_' + currentTimeStr + '.json', JSON.stringify(data), (err) => {
      if (err) throw err;
    })
  }

  private async getFeedPosts(kirtanApiParams: KirtanApiParams): Promise<[ProfilePostsResponseDTO[], string]>{
    const profilePostsResponses: ProfilePostsResponseDTO[] = []
    const response = await this.getDataFromApi(kirtanApiParams, 'kirtan_FeedData')
    if(response){
      const kirtanProfileFeedRespINTF = <IKirtanFeedResponse>(response as unknown)
      const profilePostsResponseINTF = profilePostINTFfromKirtanFeedRes(kirtanProfileFeedRespINTF)
      const profilePostResponse = new ProfilePostsResponseDTO(profilePostsResponseINTF)
      profilePostsResponses.push(profilePostResponse)
      const nextMaxId = kirtanProfileFeedRespINTF.nextMaxId
      return [profilePostsResponses, nextMaxId]
    }
    return null
  }
}
