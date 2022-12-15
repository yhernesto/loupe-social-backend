import { Controller, Get } from '@nestjs/common';
import { BrowserContextType } from '../Interfaces/browserContextType';
import { Browser } from '../models/Browser';
import { BrowserContext } from '../models/BrowserContext';
import { Page } from '../models/Page';
import { ElementHandle } from "puppeteer";
import { Tt_postService } from 'src/tik-tok/services/tt_post.service';
import { Create_tt_postDto } from '../../interfaces/dtos/tt_post.dto';

@Controller('scraper')
export class ScraperController {
  constructor(private tt_postService: Tt_postService) {}

  @Get('/main-scrape')
  async mainScrape(): Promise<void> {
    // constants
    const TIMES_TO_SCROLL = 5;
    const MAX_POSTS = 6;
    const MAIN_PAGE_URL = 'https://www.tiktok.com/es/';

    const browser: Browser = new Browser('main');
    await browser.launch();
    const browserContext: BrowserContext = await browser.newContext('main', BrowserContextType.incognito);
    const page: Page = await browserContext.newPage('main', MAIN_PAGE_URL);
    await page.setWindowSize({width: 1280, height: 926});
    
    await page.loadPage({timeToWait: 500});
    await page.reload({timeToWait: 1000});
    await page.reload({timeToWait: 1000});

    for(let times = 0; times < TIMES_TO_SCROLL; times++){
      await page.wheelOnPoint({deltaY: 400}, {x: 640, y: 420});
      await page.waitForTimeout(1000);
    }

    const tt_posts: Array<Create_tt_postDto> = await extractPosts();
    console.log('********** saving ***********');
    console.log(tt_posts.length);
    tt_posts.forEach(async (tt_post) => {try{ await this.tt_postService.create(tt_post) }catch(err){
      console.error(err.message)
    }});
    browser.close();

    
    async function extractPosts(): Promise<Array<Create_tt_postDto>>{
      const tt_posts: Array<Create_tt_postDto> = [];
      const comment_words: Array<string> = [];
      const current_time: Date = new Date();
      let post_url: string;
      let avatar_url: string;
      let avatar_title: string;
      let comment_text: string;
      let post_likes: string;
      let post_comments: string;
      let post_shares: string;
      let song_title: string;
      try{
        const posts: ElementHandle[] = await page.searchAllElements('.lazyload-wrapper');
        for(let index = 0; index < MAX_POSTS; index++){
          comment_words.splice(0, comment_words.length)
          comment_text = '';
          const raw_content = await posts[index].$$(':scope > *')
    
          try{
            const post_wrapper: ElementHandle<Element> = await raw_content[0].$("a[class$='item-video-card-wrapper']");
            if(post_wrapper != null){
              console.log('******** Post # ' + index + ' ***********')
              post_url = await post_wrapper.evaluate(node => {return node.getAttribute('href')});

              //Avatar
              const avatar_div: ElementHandle<Element> = await raw_content[0].$("a[class*='feed-item-avatar']");
              avatar_url = await avatar_div.evaluate(node => {return node.getAttribute('href')});
              avatar_title = await avatar_div.evaluate(node => {return node.getAttribute('title')});

              //Post text
              const item_content: ElementHandle<Element> = await raw_content[0].$("div[class*='tt-video-meta-caption']");
              const item_text: ElementHandle<Element>[] = await item_content.$$("strong");
              item_text.forEach(async (item) => {
                const word = await item.evaluate( node => {return node.textContent})
                comment_words.push(word)
              })

              // Song title
              const song_div: ElementHandle<Element> = await raw_content[0].$("div[class*='video-music-content']");
              song_title = await song_div.evaluate( node => {return node.textContent})

              //Likes
              const likes_div: ElementHandle<Element> = await raw_content[0].$("strong[title='like']");
              post_likes = await likes_div.evaluate(node => {return node.textContent});

              //Comments
              const comments_div: ElementHandle<Element> = await raw_content[0].$("strong[title='comment']");
              post_comments = await comments_div.evaluate(node => {return node.textContent});

              //Shares
              const shares_div: ElementHandle<Element> = await raw_content[0].$("strong[title='share']");
              post_shares = await shares_div.evaluate(node => {return node.textContent});
            }
          }catch(e){
            console.log(e)
          }

          // console.log('post url: ' + post_url);
          // console.log('avatar url:' + avatar_url);
          // console.log('avatar title:' + avatar_title);
          // console.log('likes: ' + post_likes);
          // console.log('comments: ' + post_comments);
          // console.log('shares: ' + post_shares);
          // console.log('song title: ' + song_title);
          // console.log('text post: ');
          comment_words.forEach(word => {comment_text = comment_text + ' ' + word.trim()})
          // console.log(comment_text);

           const create_tt_postDto: Create_tt_postDto = new Create_tt_postDto()
          create_tt_postDto.tt_id = post_url.substring(post_url.lastIndexOf('/') + 1, post_url.length)
          create_tt_postDto.url = post_url
          create_tt_postDto.account_name = avatar_url.match(/(?=@).*?(?=\?)/)[0]  // take a substring from @ to ?=lang=es
          create_tt_postDto.account_full_name = avatar_title
          create_tt_postDto.song_title = song_title
          create_tt_postDto.likes = textNumberWithCharToNumber(post_likes)
          create_tt_postDto.comments = textNumberWithCharToNumber(post_comments)
          create_tt_postDto.shares = textNumberWithCharToNumber(post_shares)
          create_tt_postDto.text = comment_text
          create_tt_postDto.creation_date = new Date(current_time.getTime() - (current_time.getTimezoneOffset() * 60000))

          console.log(create_tt_postDto.tt_id)
          console.log(create_tt_postDto.url)
          console.log(create_tt_postDto.account_name)
          console.log(create_tt_postDto.account_full_name)
          console.log(create_tt_postDto.likes)
          console.log(create_tt_postDto.comments)
          console.log(create_tt_postDto.shares)
          console.log(create_tt_postDto.song_title)
          console.log(create_tt_postDto.text)
          console.log(create_tt_postDto.creation_date)

          tt_posts.push(create_tt_postDto);
        };
      } catch(e){
        console.log(e)
      }

      return tt_posts;
    }


    //First method
    // async function scrapeInfiniteScrollItems(
    //   page: PuppeteerPage,
    //   extractItems,
    //   itemTargetCount,
    //   scrollDelay = 1000,
    // ) {
    //   let items = [];
    //   try {
    //     let previousHeight;
    //     while (items.length < itemTargetCount) {
    //       items = await page.evaluate(extractItems);
    //       previousHeight = await page.evaluate('document.body.scrollHeight');
    //       await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
    //       await page.waitForFunction(`document.body.scrollHeight > ${previousHeight}`);
    //       await page.waitFor(scrollDelay);
    //     }
    //   } catch(e) { }
    //   return items;
    // }

    // Second method
    // async function scrollToBottom(page) {
    //   const distance = 100; // should be less than or equal to window.innerHeight
    //   const delay = 100;
    //   while (await page.evaluate(() => document.scrollingElement.scrollTop + window.innerHeight < document.scrollingElement.scrollHeight)) {
    //     await page.evaluate((y) => { document.scrollingElement.scrollBy(0, y); }, distance);
    //     await page.waitFor(delay);
    //   }
    // }

    function textNumberWithCharToNumber(textNumberWithChar: string): number{
      let numberToReturn: number;
      textNumberWithChar= textNumberWithChar.replace(/\./, '')   
      try{
        if(/K/gi.test(textNumberWithChar)){  //gi = case-insensitive
          textNumberWithChar= textNumberWithChar.replace(/K|\./gi, '')   
          numberToReturn = Number(textNumberWithChar) * 1000;
        }else if(/M/gi.test(textNumberWithChar)) {
          textNumberWithChar= textNumberWithChar.replace(/K|\./gi, '')   
          numberToReturn = Number(textNumberWithChar) * 1000000;
        }else{
          numberToReturn = Number(textNumberWithChar);
        }
        return numberToReturn;
      }catch(e){
        return null
      }
    }
  }
}