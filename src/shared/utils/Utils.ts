import axios from "axios";
import { exec, execSync } from "child_process";
import { imageHash } from 'image-hash';
import path from "path";

export enum TimeOptions {
  MILLISECONDS=0,
  SECONDS=1, 
  MINUTES=2,
  HOURS=3,
  DAYS=4
}

export const hasValues = 
  (obj) => Object.values(obj).some(v => v !== null && typeof v !== "undefined");

// =============================================================================================> DATES

/**
 * 
 * @param date_str date string in format yyyy-mm-dd
 * @returns GMT epoch timestamp(seconds)
 */
export function stringToUTC(params: {date_str: string, end_of_day?: boolean}): number {
  const dates = params.date_str.split('-')
  const yyyy = Number(dates[0])
  const mm = Number(dates[1]) - 1
  const dd = Number(dates[2])
  return params.end_of_day ? (Date.UTC(yyyy, mm, dd, 23, 59, 59)/1000) : (Date.UTC(yyyy, mm, dd, 0, 0, 0)/1000);
}

/**
 * 
 * @param date_str date string in format yyyy-mm-dd
 * @returns GMT date object
 */
export function stringToUTCDate(params: {date_str: string, end_of_day?: boolean}): Date {
  const dates = params.date_str.split('-')
  const yyyy = Number(dates[0])
  const mm = Number(dates[1]) - 1
  const dd = Number(dates[2])
  return params.end_of_day ? new Date(Date.UTC(yyyy, mm, dd, 23, 59, 59)) : new Date(Date.UTC(yyyy, mm, dd, 0, 0, 0));
}

export function toDate(params: {date_str: string, end_of_day?: boolean, start_of_day?: boolean}): Date {
  const date_regex = /^\d{4}-\d{2}-\d{2}$/ ;
  if(params.date_str && date_regex.test(params.date_str)){
    const toReturn = new Date(params.date_str)
    if(params.end_of_day){
      toReturn.setHours(23,59,59)
      return toReturn
    }
    if(params.start_of_day){
      toReturn.setHours(0,0,0)
      return toReturn
    }
  }
}

export function strYear(date: Date, short_format: boolean): string {
  const year = date.getFullYear();
  if(short_format){
    return year.toString().substr(2,4) 
  }
  return year.toString(); 
}

export function strMonth(date: Date): string {
  const month = date.getMonth() + 1;
  return month < 10 ? '0' + month : '' + month; 
}

export function strDay(date: Date): string {
  const day = date.getDate();
  return day < 10 ? '0' + day : '' + day; 
}

export function strHour(date: Date): string {
  const hour = date.getHours();
  return hour < 10 ? '0' + hour : '' + hour; 
}

export function strMinutes(date: Date): string {
  const minutes = date.getMinutes();
  return minutes < 10 ? '0' + minutes : '' + minutes; 
}

export function strSeconds(date: Date): string {
  const seconds = date.getSeconds();
  return seconds < 10 ? '0' + seconds : '' + seconds; 
}

/**
 * 
 * @param params date_1: Minuend, date_2: subtrahend, options: TimeOptions Value [MILLISECONDS, SECONDS, MINUTES, HOURS, DAYS]
 * @returns time diffs. Depends on TimeOptions value
 */
export function diffDates(params: {date_1: Date, date_2: Date, options: TimeOptions}): number | null{
  const { date_1, date_2, options } = params
  if(date_1 && date_2){
    switch(options){
      case 0:   //Milliseconds
        return Math.abs(date_1.getTime() - date_2.getTime())
      
      case 1:   //Seconds
        return Math.ceil(Math.abs(date_1.getTime() - date_2.getTime())/1000)
      
      case 2:   //Minutes
        return Math.ceil(Math.abs(date_1.getTime() - date_2.getTime())/(1000 * 60))
      
      case 3:   //Hours
        return Math.ceil(Math.abs(date_1.getTime() - date_2.getTime())/(1000 * 60 * 60))
      
      case 4:  //Days
        return Math.ceil(Math.abs(date_1.getTime() - date_2.getTime())/(1000 * 60 * 60 * 24))

    }
  }else{
    console.error('diffDates fail because first or second date parameter is null');
    return null
  }
}

export function timestampToDate(unixValue: number): Date|null{
  let unit = 1
  if(unixValue == null){
    console.error('The unix value is null');
    return null
  }
  const len = unixValue.toString().length
  if(len < 10 || len > 13){
    console.error('The unix value is too small or too large');
    return null
  }

  if(len < 13){
    unit = unit * 1000
  }
  
  const dateConverted: Date = new Date(unixValue * unit)
  return dateConverted;
}

// =============================================================================================> END DATES

export function roundDecimal(params: {number: number, decimals: number}): number {
  const {number, decimals} = params
  if((number != null && number != undefined) && (decimals != null && decimals != undefined)){
    const _decimals = Math.pow(10, decimals)
    const roundedDecimal = Math.round((number + Number.EPSILON) * _decimals) / _decimals
    return roundedDecimal
  }
  return null
}

export function percentageDifference(params : {prev: number, current: number}): number {
  const {prev, current} = params
  if(prev > 0){
    if(current){
      const diff = ((current-prev)/prev)*100
      if(diff){ return roundDecimal({number: diff, decimals: 2}) || 0 }
    }else{
      return -100
    }
  }else{
    if(current){ return 100 }
  }
  return 0
}

export async function executeCommand(command: string): Promise<string>{
  let res
  try{
    exec(command, (error, stdout, stderr) => {
      if (error) {
        const err = (`error: ${error.message}`);
        console.info(err);
        res = err;
      }
      if (stderr) {
        const std_err = (`stderr: ${stderr}`);
        console.info(std_err);
        res = std_err;
      }
      const std_out = (`stdout: ${stdout}`);
      console.info(std_out)
      res = std_out
    });
    return res
  }catch(e){
    throw e
  }
}

export async function executeAsyncCommand(command: string): Promise<string>{
  try{
    const result = await execSync(command);
    return result.toString()
  }catch(e){
    throw e
  }
}

export async function hashImageByUrl(uri: string): Promise<string>{
  const url_exists = await urlExists(uri)
  if(url_exists){
    const res = new Promise((resolve, reject) => {
      try{
      imageHash(uri, 8, true, async (error, data) => {
          if (await error) throw error;
          const res_data = await data
          resolve(res_data)
          reject('there was no possible get hash from image: ' + uri)
        });
      }catch(e){
        console.error('there was no possible get hash from image: ' + uri)
        return null
      }
    })
    return <string>(res as unknown)
  }
  return null
};

export async function urlExists(uri: string): Promise<boolean>{
    try {
      await axios.head(uri);
      return true;
    } catch (error) {
      if (error.response.status >= 400) {
        return false;
      }
    }
}

//https://codeburst.io/javascript-async-await-with-foreach-b6ba62bbf404
export async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

export function delay(time) {
  console.log('delaying by: ' + time)
  return new Promise(resolve => setTimeout(resolve, time));
}

export function   removeEmptyLines(text: string): string{
  text = text.replace(/(^[ \t]*\n)/gm, "")
  return text
}

export function removeLinesWithSingleChars(text: string): string | null{
  const regex = /\.|\*|-|·|\+|•⁣/g
  const lines = text.split('\n')
  const clearLines = lines.map(line =>{
    if(line.length > 2){
      return line
    }else{
      if(!line.match(regex)){
        return line
      }
      return null
    }
  })
  return clearLines.filter(line=> line != null)?.join('\n')
}

export function timestampConverter(timestamp: number, option: TimeOptions): number {
  const tsLength = timestamp.toString().length
  let timestampConverted
  switch(option){
    case TimeOptions.SECONDS :
      if(tsLength > 10) timestampConverted = timestamp/1000
      break;
    default:
      timestampConverted = timestamp
      break;
  }
  return timestampConverted || timestamp
}

export function editFileName(req, file, callback) {
  const name = file.originalname.split('.')[0];
  const fileExtName = path.parse(file.originalname).ext;
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(null, `${name}-${randomName}${fileExtName}`);
}

export function getExtension(fileName: string): string{
  return fileName.split('.').pop()
}