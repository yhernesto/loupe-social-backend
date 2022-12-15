import { Page as PuppeteerPage, ElementHandle, KeyInput } from "puppeteer";
import { ResourceType } from 'src/tik-tok/scraper/Interfaces/resourceType';
import { BrowserContext } from './BrowserContext';
import { WindowSize, NavigationOptions, PointInWindow, ScreenshotOptions, WheelOptions } from 'src/tik-tok/scraper/Interfaces/page';


export class Page {
  puppeteerPage: PuppeteerPage;
  browserContext: BrowserContext;
  name: string;
  url: string;

  constructor(name: string, url: string, browserContext: BrowserContext){
    this.name = name;
    this.url = url;
    this.browserContext = browserContext;
  }

  async initialize(): Promise<void> {
    this.puppeteerPage = await this.browserContext.puppeteerBrowserContext.newPage();
  }

  async loadPage(navigationOption?: NavigationOptions): Promise<void> {
    await this.puppeteerPage.goto(this.url);
    if(navigationOption.timeToWait){
      await this.waitForTimeout(navigationOption.timeToWait)
    }else{
      await this.waitForNavigation();
    }
  }

  async requestInterception(state: boolean): Promise<void>{
    this.puppeteerPage.setRequestInterception(state);
  }

  async interceptRequestsOn(type: ResourceType): Promise<void> {
    this.puppeteerPage.on('request', (request) => {
      if (request.resourceType() !== type) {
          request.continue();
      } else {
          request.abort();
      }
    });
  }

  async getImagesUrls(): Promise<string[]>{
    const links: string[] = [];
    this.puppeteerPage.on('response', async (response) => {
      const matches = /.*\.(jpg|png|svg|gif).(quality).*$/.exec(response.url());
      if (matches) {
        console.log("ScraperController -> matches", matches)
        links.push(matches.input);
      }
    });
    return links;
  }

  async click(elementName: string): Promise<void> {
    await this.puppeteerPage.click(elementName);
  }

  async waitForTimeout(milliseconds: number): Promise<void> {
    await this.puppeteerPage.waitForTimeout(milliseconds);
  }

  async pressKeyboard(keyName: KeyInput): Promise<void> {
    await this.puppeteerPage.keyboard.press(keyName);
  }

  async moveCursorTo(point: PointInWindow){
    await this.puppeteerPage.mouse.move(point.x, point.y)
  }

  async wheelOnPoint(wheelOptions: WheelOptions, point?: PointInWindow): Promise<void> {
    await this.puppeteerPage.mouse.move(point.x, point.y)
    if(wheelOptions.deltaY) await this.puppeteerPage.mouse.wheel({deltaY: wheelOptions.deltaY})
    //if(wheelOptions.deltaX) await this.puppeteerPage.mouse.wheel({deltaX: wheelOptions.deltaX})
  }

  async searchElement(elementName: string): Promise<ElementHandle<Element>> {
    return await this.puppeteerPage.$(elementName);
  }

  async searchAllElements(elementName: string): Promise<ElementHandle[]>{
    return await this.puppeteerPage.$$(elementName);
  }

  async waitForSelectorLoaded(selectorName: string, isVisible: boolean): Promise<void> {
    await this.puppeteerPage.waitForSelector(selectorName, {visible: isVisible});
  }

  async waitForNavigation(){
    await this.puppeteerPage.waitForNavigation();
  }

  async bringToFront(): Promise<void>{
    await this.puppeteerPage.bringToFront();
  }

  async screenshot(screenshotOptions: ScreenshotOptions): Promise<string | Buffer>{
    return await this.puppeteerPage.screenshot(
      {path: screenshotOptions.path, type: screenshotOptions.type, fullPage: screenshotOptions.fullPage}
    );
  }

  async clickOnElement(element: ElementHandle<Element>) {
    const rect = await this.puppeteerPage.evaluate(el => {
      const { top, left, width, height } = el.getBoundingClientRect();
      return { top, left, width, height }
    }, element);

    // Use given position or default to center
    const _x = rect.width / 2;
    const _y = rect.height / 2;

    await this.puppeteerPage.mouse.click(rect.left + _x, rect.top + _y)
  }

  async close(): Promise<void> {
    this.browserContext.pages = this.browserContext.pages.filter(page => page.name !== this.name)
    this.puppeteerPage.close()
  }
  
  async setWindowSize(windowSize: WindowSize): Promise<void> {
    await this.puppeteerPage.setViewport({ width: windowSize.width, height: windowSize.height })
  }

  async reload(reload: NavigationOptions): Promise<void> {
    await this.puppeteerPage.reload();
    await this.waitForTimeout(reload.timeToWait);
  }
}