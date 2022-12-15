import { BrowserContext as PuppeteerBrowserContext} from "puppeteer";
import { Page } from './Page';
import { Browser } from './Browser';
import { BrowserContextType } from "src/tik-tok/scraper/Interfaces/browserContextType";

export class BrowserContext {
  name: string;
  type: BrowserContextType;
  pages: Page[];
  puppeteerBrowserContext: PuppeteerBrowserContext;
  browser: Browser;
  
  constructor(name: string, type: BrowserContextType, browser: Browser){
    this.name = name;
    this.type = type;
    this.browser = browser;
    this.pages = [];
  }

  public async initialize(){
    if(this.type === BrowserContextType.default.valueOf()){
      this.puppeteerBrowserContext = this.browser.puppeteerBrowser.defaultBrowserContext();
    }else{
      this.puppeteerBrowserContext = await this.browser.puppeteerBrowser.createIncognitoBrowserContext();
    }
  }

  public async newPage(name: string, url: string): Promise<Page> {
    const page: Page = new Page(name, url, this);
    await page.initialize();
    this.pages.push(page);
    return page;
  }

  public async close(){
    this.puppeteerBrowserContext.close();
  }

}