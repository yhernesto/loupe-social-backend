// API URL: https://rapidapi.com/Prasadbro/api/instagram47/

import { PsadbroApiParams, PsadbroHashtagPostsQueryParams, PsadbroProfileQueryParams } from '../interfaces/psadbro-api.intf';
import { AbstractHandler } from '../handler.abstract';
import { HashtagResponseDTO, HashtagResponseINTF } from '../interfaces/dtos/HashtagResponse.dto'
import { RapidApi } from '../../../shared/constants/instagram.constants'
import { ProfileResponseDTO, ProfileResponseINTF } from '../interfaces/dtos/ProfileResponse.dto'
import { ProfilePostsResponseDTO, IProfilePostsResponse } from '../interfaces/dtos/ProfilePostsResponse.dto'
import { PsadbroProfilePostsQueryParams } from '../interfaces/psadbro-api.intf'
import  * as fs from 'fs';
import { AppLoggerService } from 'src/shared/modules/app-logger/app-logger.service';

export class PsadbroHandler extends AbstractHandler{
  private readonly appLogger = new AppLoggerService(PsadbroHandler.name)

  // --------------------- Hashtag -----------------------------
  public async getHashtagData(hashtagName: string): Promise<HashtagResponseDTO>{
    const endpointName = RapidApi.PSADBRO.HASHTAG.ENDPOINT_NAME
    const endpointUrl: string = this.buildEndpoint({endpoint_name: endpointName})
    try{
      if(true){
        const hashtagPostsQueryParams: PsadbroHashtagPostsQueryParams = {hashtag: hashtagName}
        const psadbroApiParams: PsadbroApiParams = {endpointUrl: endpointUrl, params: hashtagPostsQueryParams}
        const response = await this.getDataFromApi(psadbroApiParams, endpointName)
        if(response){
          const hashtag_responseINTF: HashtagResponseINTF = <HashtagResponseINTF>(response as unknown)
          return new HashtagResponseDTO(hashtag_responseINTF)
        }
        return null
      }
      return super.getHashtagData(hashtagName)
    }catch(err){
      console.info(err)
      throw err
    }
  }

// ---------------------- Profile ------------------------------
  public async getProfileData(user_id: number, username: string): Promise<ProfileResponseDTO>{
    const endpointName = RapidApi.PSADBRO.PROFILE.USER_INFO_EP_NAME
    const endpointUrl: string = this.buildEndpoint({endpoint_name: endpointName})
    try{
      if(true){
        const profileQueryParams: PsadbroProfileQueryParams = {userid: user_id}
        const psadbroApiParams: PsadbroApiParams = {endpointUrl: endpointUrl, params: profileQueryParams}
        const response = await this.getDataFromApi(psadbroApiParams, endpointName)
        if(response){
          const profile_responseINTF: ProfileResponseINTF = <ProfileResponseINTF>(response as unknown)
          return new ProfileResponseDTO(profile_responseINTF)
        }
        return null
      }
      return super.getProfileData(user_id, username)
    }catch(e){
      console.info(e)
      throw e
    }
  }


// ---------------------- Profile Posts ------------------------------
  public async getProfilePostsData(username: string): Promise<ProfilePostsResponseDTO>{
    const endpointName = RapidApi.PSADBRO.PROFILE.USER_POSTS_EP_NAME
    const endpointUrl: string = this.buildEndpoint({endpoint_name: RapidApi.PSADBRO.PROFILE.USER_POSTS_EP_NAME})
    try{
      if(true){
        const profilePostsQueryParams: PsadbroProfilePostsQueryParams = {username: username}
        const psadbroApiParams: PsadbroApiParams = {endpointUrl: endpointUrl, params: profilePostsQueryParams}
        const response = await this.getDataFromApi(psadbroApiParams, endpointName)
        if(response){
          const profilePostsResponseINTF = <IProfilePostsResponse>(response as unknown)
          return new ProfilePostsResponseDTO(profilePostsResponseINTF)
        }
        return null
      }
    }catch(err){
      throw err
    }
  }



// -------------------------------------------------------------
// ------------------------- Shared ----------------------------
  private async getDataFromApi(psadbroHashtagApiParams: PsadbroApiParams, endpointName: string): Promise<any>{
    const key = this.configService.get<string>('PSADBRO_API_KEY')
    const host = this.configService.get<string>('PSADBRO_API_HOST')
    try{
      this.appLogger.notice(this.getDataFromApi.name, 'calling RapidApi EP: ' + psadbroHashtagApiParams.endpointUrl + ', with params: ', JSON.stringify(psadbroHashtagApiParams.params))
      const response = await this.httpService.get(
        psadbroHashtagApiParams.endpointUrl,
        {
          headers:{
            "x-rapidapi-key": key,
            "x-rapidapi-host": host, 
            "useQueryString": true
          }, 
          params: psadbroHashtagApiParams.params,
        }).toPromise().then(res => res.data)

      if(response.status !== 'Success')
        throw new Error('Psadbro API is not returning a properly response: ' + '\n' + 'current response: ' + JSON.stringify(response))

      this.writeFileOutResponse(response.body, endpointName)
     
      return response.body          

      //reading from file
      // const rawdata = fs.readFileSync(__dirname + '/profilePosts.json');
      // return JSON.parse(rawdata.toString())
    }catch(error){
      // console.info(error)
      throw error
    }
  }

  private buildEndpoint(param: {endpoint_name: string}): string {
    return this.configService.get<string>('PSADBRO_API_ENDPOINT') + '/' + param.endpoint_name
  }

  private writeFileOutResponse(data: any, ep_name: string): void {
    const currentTime = new Date()
    const currentTimeStr = currentTime.getFullYear() + '-' + (currentTime.getMonth() + 1) + '-' + currentTime.getDate() + '_' + 
    currentTime.getHours() + '_' + currentTime.getMinutes() + '_' + currentTime.getSeconds()
    fs.writeFile(__dirname + '/' + ep_name + '_' + currentTimeStr + '.json', JSON.stringify(data), (err) => {
      if (err) throw err;
    })
  }
}