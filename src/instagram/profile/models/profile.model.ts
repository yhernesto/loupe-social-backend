import { IImage } from 'src/instagram/shared/interfaces/dtos/Image.intf';
import { ProfileStatsLogINTF } from 'src/shared/modules/database/interfaces/Profile/ProfileStatsLog.intf';
import { hashImageByUrl, strDay, strHour, strMinutes, strMonth, strSeconds, strYear } from 'src/shared/utils/Utils';
import { ProfileINTF, ProfileDTO } from '../../shared/interfaces/dtos/Profile.dto'

export class Profile extends ProfileDTO{
  constructor(profileINTF: ProfileINTF) {
    super(profileINTF);
  }

  async getCreateProfileINTF(): Promise<ProfileINTF>{
    const hash = await this.getProfilePicHash()
    const profile_pic: IImage = {
      source_url: this.profile_pic.source_url,
      hash: hash,
      name: this.getProfilePicName() 
    }

    const createProfileINTF: ProfileINTF = (
      {
        ig_id: this.ig_id,    //PK,
        username: this.username,
        full_name: this.full_name,
        biography: this.biography,
        profile_pic: profile_pic,
        is_verified: this.is_verified,
        //---- stats -----
        media_count: this.media_count,
        following_count: this.following_count,
        follower_count: this.follower_count,
        total_igtv_videos: this.total_igtv_videos,
        total_clips_count: this.total_clips_count,
        total_ar_effects: this.total_ar_effects,
        usertags_count: this.usertags_count,
        mutual_followers_count: this.mutual_followers_count,
        //----------------
        external_url: this.external_url,
        has_videos: this.has_videos,
        category: this.category,
        account_type: this.account_type,
        is_private: this.is_private,
        is_business: this.is_business,
        is_favorite: this.is_favorite,
        is_interest_account: this.is_interest_account,
        has_biography_translation: this.has_biography_translation,
        direct_messaging: this.direct_messaging,
        has_highlight_reels: this.has_highlight_reels,
        has_chaining: this.has_chaining,
        has_guides: this.has_guides,
        city_name: this.city_name,
        zip: this.zip,
        city_id: this.city_id,
        address_street: this.address_street,
        longitude: this.longitude,
        latitude: this.latitude,
        public_email: this.public_email,
        whatsapp_number: this.whatsapp_number,
        contact_phone_number: this.contact_phone_number,
        public_phone_country_code: this.public_phone_country_code,
        public_phone_number: this.public_phone_number,
        business_contact_method: this.business_contact_method,
        smb_delivery_partner: this.smb_delivery_partner,
        smb_support_delivery_partner: this.smb_support_delivery_partner,
        is_eligible_for_smb_support_flow: this.is_eligible_for_smb_support_flow,
        is_potential_business: this.is_potential_business,
        is_memorialized: this.is_memorialized,
        can_be_reported_as_fraud: this.can_be_reported_as_fraud
      }
    )
    return createProfileINTF
  }

  getCreateProfileStatsLogINTF(): ProfileStatsLogINTF{
    const createProfileStatsLogINTF: ProfileStatsLogINTF = {
      user_ig_id: this.ig_id,
      media_count: this.media_count,
      following_count: this.following_count,
      follower_count: this.follower_count,
      total_igtv_videos: this.total_igtv_videos,
      total_clips_count: this.total_clips_count,
      total_ar_effects: this.total_ar_effects,
      usertags_count: this.usertags_count,
      mutual_followers_count: this.mutual_followers_count,
    }
    return createProfileStatsLogINTF
  }

  private async getProfilePicHash(): Promise<string> {
    if(this.profile_pic?.source_url ){
      try{
        return await hashImageByUrl(this.profile_pic.source_url)
      }catch(e){
        throw e
      }
    }
  }

  private getProfilePicName(): string {
    if(this.profile_pic?.source_url ){
      try{
        const now = new Date()
        return this.ig_id + '-' + strYear(now, true) + strMonth(now) + strDay(now) + '_' + strHour(now) + strMinutes(now) + strSeconds(now)
      }catch(e){
        throw e
      }
    }
  }

}