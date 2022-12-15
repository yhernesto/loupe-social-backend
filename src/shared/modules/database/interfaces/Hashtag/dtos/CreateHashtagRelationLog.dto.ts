import { IsNotEmpty } from "class-validator";
import { HashtagRelationLogINTF, HashtagRelationINTF } from '../hashtagRelationLog.intf'

export class CreateHashtagRelationLogDTO {
  @IsNotEmpty()
  parent: string

  @IsNotEmpty()
  relations: HashtagRelationINTF[];

  constructor(hashtagRelationLogDTOInterface: HashtagRelationLogINTF){
    this.parent = hashtagRelationLogDTOInterface.parent
    this.relations = hashtagRelationLogDTOInterface.relations
  }
}