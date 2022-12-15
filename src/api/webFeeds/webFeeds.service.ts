import { Inject, Injectable } from '@nestjs/common';
import { WebFeeds_topicsINTF } from 'src/shared/modules/database/interfaces/WebFeeds/webFeeds_topics.intf';
import { NewsService } from 'src/third-party-apis/Google/news/news.service';
import { ReqWebFeedsDTO } from './interfaces/dtos/ReqWebFeeds.dto';
import { ResWebFeedINTF } from './interfaces/dtos/ResWebFeed.dto';
import { GOOGLE_NEWS_PARAMETERS_NAME } from './constants/constants';
import { Url } from 'src/shared/utils/Url';
import { WebFeeds_countryLangINTF } from 'src/shared/modules/database/interfaces/WebFeeds/webFeeds_countryLang.intf';
import { ResWebFeedsCountryLanguagesINTF } from './interfaces/dtos/ResWebFeedsCountryLanguages.dto';
import { ResWebFeedTopicsINTF } from './interfaces/dtos/ResWebFeedTopics.dto';
import { WebFeeds_countryLanguagesINTF } from 'src/shared/modules/database/interfaces/WebFeeds/webFeeds_countryLanguages.intf';
import { TRENDING_NEWS_ROW, TRENDING_NEWS_ROW_US_EN } from 'src/third-party-apis/Google/constants/constants';

@Injectable()
export class WebFeedsService {
  private WEB_FEEDS_TOPICS: WebFeeds_topicsINTF[]
  private WEB_FEEDS_COUNTRY_LANG: WebFeeds_countryLangINTF[]
  private WEB_FEEDS_COUNTRY_LANGUAGES: WebFeeds_countryLanguagesINTF[]
  constructor(
    @Inject('WEB_FEEDS_TOPICS') private _web_feeds_topics,
    @Inject('WEB_FEEDS_COUNTRY_LANG') private _web_feeds_country_lang, 
    @Inject('WEB_FEEDS_COUNTRY_LANGUAGES') private _web_feeds_country_languages, 
    private newsService: NewsService
  ){
    this.WEB_FEEDS_TOPICS = _web_feeds_topics
    this.WEB_FEEDS_COUNTRY_LANG = _web_feeds_country_lang
    this.WEB_FEEDS_COUNTRY_LANGUAGES = _web_feeds_country_languages
  }

  async getFeeds(reqWebFeedsDTO: ReqWebFeedsDTO): Promise<ResWebFeedINTF>{
    // if(reqWebFeedsDTO.search){
    //   const webFeedsUrl: string = this.createWebFeedUrlBySearch(reqWebFeedsDTO)
    //   return await this.newsService.getNews({web_feeds_url: webFeedsUrl})
    // }
    
    if(reqWebFeedsDTO.direct_url){
      try{
        const url = this.createWebFeedUrlDirectly(reqWebFeedsDTO?.direct_url)
        return await this.newsService.getNews({web_feeds_url: url})
      }catch(e){ throw e }
    }
    
    if(reqWebFeedsDTO.topic_url){
      try{
        const { webFeedsUrl, trending_required } = this.createWebFeedUrlByTopic(reqWebFeedsDTO)
        const row_to_search = this.isNewsFromUsEn(reqWebFeedsDTO) ? TRENDING_NEWS_ROW_US_EN : TRENDING_NEWS_ROW
        return await this.newsService.getNews({web_feeds_url: webFeedsUrl, trending_news_required: trending_required, row_to_search: row_to_search})
      }catch(e){throw e}
    }

  }

  public getWebFeedsCountryLanguages(): ResWebFeedsCountryLanguagesINTF[]{
    return this.WEB_FEEDS_COUNTRY_LANGUAGES || []
  }

  public getWebFeedsTopics(): ResWebFeedTopicsINTF[]{
    const topics_configurations: ResWebFeedTopicsINTF[] = []
    this.WEB_FEEDS_TOPICS.forEach(topicObj => {
      const {topic, order, sections, country, lang, url, gf_icon} = topicObj
      topics_configurations.push(
        {topic: topic, order: order, gf_icon: gf_icon, sections: sections, country: country, lang: lang, url: url}
      )
    })
    return topics_configurations || []
  }


  // ************************************************************** //
  // ********************** PRIVATE METHODS *********************** //

  private createWebFeedUrlBySearch(reqWebFeedsDTO: ReqWebFeedsDTO): string {
    const webFeedsURL: Url = new Url(GOOGLE_NEWS_PARAMETERS_NAME.BASE_URL)
    const location: string = reqWebFeedsDTO.location
    const language: string = reqWebFeedsDTO.language
    const country_lang_parameters: string = 
        this.WEB_FEEDS_COUNTRY_LANG.find(parameters => parameters.country === location && parameters.lang === language)?.url_parameters
    

    webFeedsURL.addPath({path: GOOGLE_NEWS_PARAMETERS_NAME.SEARCH})
    webFeedsURL.startQuery()
    webFeedsURL.addParameter({name: GOOGLE_NEWS_PARAMETERS_NAME.QUERY, value: reqWebFeedsDTO.search})
    webFeedsURL.addParameter({value: country_lang_parameters})

    return webFeedsURL.url
  }

  private createWebFeedUrlByTopic(reqWebFeedsDTO: ReqWebFeedsDTO): { webFeedsUrl: string, trending_required: boolean } {
    const webFeedsURL: Url = new Url(GOOGLE_NEWS_PARAMETERS_NAME.BASE_URL)
    const location: string = reqWebFeedsDTO.location
    const language: string = reqWebFeedsDTO.language
    let trending_required = false
    const country_lang_parameters: string = 
        this.WEB_FEEDS_COUNTRY_LANG.find(parameters => parameters.country === location && parameters.lang === language)?.url_parameters
    
    if(reqWebFeedsDTO.topic_url){
      trending_required = reqWebFeedsDTO.topic_url === 'topstories'
      webFeedsURL.addPath({path: reqWebFeedsDTO.topic_url})
      if(reqWebFeedsDTO.section_url){
        webFeedsURL.addPath({path: reqWebFeedsDTO.section_url})
      }
    }

    webFeedsURL.startQuery()
    webFeedsURL.addParameter({value: country_lang_parameters}) 

    return { webFeedsUrl: webFeedsURL.url, trending_required: trending_required }
  }

  private createWebFeedUrlDirectly(url: string): string {
    if(url.startsWith('.')){
      url = url.substring(1, url.length)
    }
    return GOOGLE_NEWS_PARAMETERS_NAME.BASE_URL + url
  }

  private isNewsFromUsEn(reqWebFeedsDTO: ReqWebFeedsDTO): boolean {
    let {language, location} = reqWebFeedsDTO
    language = language.toLowerCase()
    location = location.toLowerCase()
    if(language === 'en' && location === 'us'){
      return true
    }
    return false
  }
}