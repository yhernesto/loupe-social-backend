export interface TopHour {
  day_number: number,
  day_hour: number,
  likes: number,
  comments: number
}

export interface ResTopTimeToPostINTF {
  likes?: TopHour[],
  comments?: TopHour[]
}