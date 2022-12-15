import { Browser as PuppeteerBrowser, BrowserContext as PuppeteerBrowserContext} from "puppeteer";
import { BrowserContext } from './BrowserContext';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import puppeteerExtra from 'puppeteer-extra';
import { BrowserContextType } from "src/tik-tok/scraper/Interfaces/browserContextType";


export class Browser {
  puppeteerBrowser: PuppeteerBrowser;
  contexts: BrowserContext[];
  name: string;

  constructor(name: string) {
    this.name = name;
    this.contexts = [];
  }

  async launch(): Promise<void>{
    puppeteerExtra.use(StealthPlugin());
    this.puppeteerBrowser = await puppeteerExtra.launch({headless: true});
  }
  
  async newContext(name: string, type: BrowserContextType): Promise<BrowserContext>{
    const context: BrowserContext = new BrowserContext(name, type, this);
    await context.initialize();
    this.contexts.push(context);
    return context;
  }

  close(){
    this.puppeteerBrowser.close();
  }
}