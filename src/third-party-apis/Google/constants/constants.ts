export const MAIN_GOOGLE_NEWS_URL = 'https://news.google.com'
export const MAX_ARTICLES = 100
export const TRENDING_NEWS_ROW = 1
export const TRENDING_NEWS_ROW_US_EN = 4
export const CACHE_EXPIRATION_TIME = 10000  //milliseconds

//https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry#logseverity
export enum CLOUD_LOGGING_SEVERITY {
  DEFAULT = 'DEFAULT',	//(0) The log entry has no assigned severity level.
  DEBUG = 'DEBUG',      //(100) Debug or trace information.
  INFO = 'INFO',        //(200) Routine information, such as ongoing status or performance.
  NOTICE = 'NOTICE',	  //(300) Normal but significant events, such as start up, shut down, or a configuration change.
  WARNING = 'WARNING',	//(400) Warning events might cause problems.
  ERROR = 'ERROR',      //(500) Error events are likely to cause problems.
  CRITICAL= 'CRITICAL',	//(600) Critical events cause more severe problems or outages.
  ALERT = 'ALERT',	    //(700) A person must take an action immediately.
  EMERGENCY = 'EMERGENCY' //(800) One or more systems are unusable.
}