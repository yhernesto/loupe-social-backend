import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import axios from 'axios'
import cheerio from 'cheerio'
import { ReqNewsINTF, ReqNewsDTO } from './Interfaces/ReqNews.dto';
import { ResNewsINTF, News, TrendingTopics } from './Interfaces/ResNews.intf';
import { MAX_ARTICLES } from '../constants/constants';
import {Cache} from 'cache-manager'

@Injectable()
export class NewsService {

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
    // await this.cacheManager.set('key', 'value', { ttl: 6000 });
  }

  async getNews(reqNewsINTF: ReqNewsINTF): Promise<ResNewsINTF>{
    const reqNewsDTO = new ReqNewsDTO(reqNewsINTF)
    const feed_url = reqNewsDTO.web_feeds_url
    console.info(feed_url)
    //verify if data is cached
    const cached = await this.cacheManager.get(feed_url)
    if(cached){
      console.info('route ' + feed_url + ' is cached')
      return cached as ResNewsINTF
    }else{
      const AxiosInstance = axios.create(); // Create a new Axios Instance
      try {
        let trending_topics: TrendingTopics[]
        const { data: page_html } = await AxiosInstance.get(feed_url);
  
        const news_list: News[] = this.getNewsFromHTML(page_html, MAX_ARTICLES)
  
        console.log('news length: ' + news_list.length)
        if(reqNewsDTO.trending_news_required)
          { trending_topics = this.getTrendingNewsFromHTML(page_html, reqNewsDTO.row_to_search) }
        const resNews: ResNewsINTF = { news: news_list, trending_topics: trending_topics }
  
        //caching data
        await this.cacheManager.set(feed_url, resNews);

        return resNews
      } catch (error) {
        throw error;
      }
    }
  }

  // *************************************************************************** //
  // ****************************  PRIVATE METHODS ***************************** //

  private getNewsFromHTML(html: any, max_articles: number): News[]{
    let articles_counter = 0
    const $ = cheerio.load(html);
    
    const news_list: News[] = [];
    $('article[jscontroller][jsmodel]').each((_idx, el) => {
      articles_counter++
      if(articles_counter <= max_articles){
        let image_url = '', title = '', date = '', source_url = '', source_name = ''
        $(el).prev().find('figure > img').each((_idx, img) => {
          const raw_image_url = $(img).attr('srcset')
          image_url = raw_image_url ? getImageWithBestSize(raw_image_url) : ''
        })

        //getting news url
        $(el).find('h3 > a, h4 > a').each((_idx, a) => {
          title = $(a).text()
          source_url = $(a).attr('href')
        });

        //getting news headline
        $(el).find('div > div > a').each((_idx, a) => {
          source_name = $(a).text()
        });

        //getting news time
        $(el).find('div > div > time').each((_idx, time) => {
          date = $(time).text()
        });

        const news: News = {
          title: title,
          image_url: image_url,
          source: {
            date: date,
            name: source_name,
            url: source_url,
          },
        }
        news_list.push(news)
      }
    })
    return news_list
  }

  private getTrendingNewsFromHTML(html: any, row_to_search: number): TrendingTopics[] {
    const trending_topics: TrendingTopics[] = []
    const trending_topics_names: string[] = []
    const trending_urls: string[] = []
    console.log('row to search: ' + row_to_search)
    try{
      const $ = cheerio.load(html);
      $('aside > c-wiz > div > div').each((_idx, trends_column) => {
        if(_idx == row_to_search){
  
          //get trending topic's names
          $(trends_column).find('span > span').each((_idx2, trending_span) => {
            trending_topics_names.push($(trending_span).text())
          })
  
          //getting trending topic's urls
          $(trends_column).find('a[href]').each((_idx2, trending_url) => {
            trending_urls.push($(trending_url).attr('href'))
          })
        }
      })
      trending_topics_names.forEach((name, _idx) => {
        trending_topics.push({name: name, url: trending_urls[_idx]})
      })
      return trending_topics
    }catch(e){
      throw e
    }
  }
}

function getImageWithBestSize(raw_image_url: string): string {
  const BEST_IMAGE_SIZE = 1  // 1: 2x size. Change it for array.length - 1 to get largest image
  let bestImage: string

  const urls = raw_image_url.split(',')
  if(urls.length > 1){  //there is more than images with different sizes
    const url_and_size = urls[BEST_IMAGE_SIZE].trim().split(' ')
    //const url_and_size = urls[this.BEST_IMAGE_SIZE].split(' ')  // to get largest image replace 'this.BEST_IMAGE_SIZE' by 'urls.length - 1'
    bestImage = url_and_size[0]
  }else{
    const url_and_size = urls[0].trim().split(' ')
    bestImage = url_and_size[0]
  }
  return bestImage
}
