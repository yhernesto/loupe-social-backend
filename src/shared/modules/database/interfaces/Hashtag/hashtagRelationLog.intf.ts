export interface HashtagRelationINTF{
  child: string,
  occurrences: number
}

export interface HashtagRelationLogINTF{
  parent: string,
  relations: HashtagRelationINTF[], 
  createdAt?: Date
}