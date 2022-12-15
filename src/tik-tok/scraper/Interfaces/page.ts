export interface WindowSize {
  /** The page width in pixels. */
  width: number;

  /** The page height in pixels. */
  height: number;
}

export interface NavigationOptions {
  /** Time, in milliseconds, to wait after the page has been reloaded */
  timeToWait?: number;
  LoadEvent?: LoadEvent;
}

export interface ScreenshotOptions {
  /**
   * The file path to save the image to. The screenshot type will be inferred from file extension.
   * If `path` is a relative path, then it is resolved relative to current working directory.
   * If no path is provided, the image won't be saved to the disk.
   */
  path?: string;

  /**
   * The screenshot type.
   * @default png
   */
  type?: 'jpeg' | 'png';

  /**
   * When true, takes a screenshot of the full scrollable page.
   * @default false
   */
  fullPage?: boolean;
}

export interface PointInWindow{
  x: number,
  y: number
}

export interface WheelOptions {
  /**
   * X delta in CSS pixels for mouse wheel event. Positive values emulate a scroll right and negative values a scroll left event.
   * @default 0
   */
  deltaX?: number;

  /**
   * Y delta in CSS pixels for mouse wheel event. Positive values emulate a scroll up and negative values a scroll down event.
   * @default 0
   */
  deltaY?: number;
}

export type LoadEvent = 'waitForNavigation';