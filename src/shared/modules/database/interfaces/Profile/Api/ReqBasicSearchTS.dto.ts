import { IsNotEmpty, IsNumberString, validateOrReject } from "class-validator";

export interface IReqBasicSearchTS {
  _profile_id: string
  min_date: number
}


export class ReqBasicSearchTSDTO implements IReqBasicSearchTS {
  @IsNotEmpty()
  @IsNumberString()
  _profile_id: string

  @IsNotEmpty()
  @IsNumberString()
  min_date: number

  constructor(basicSearchINTF: Partial<IReqBasicSearchTS> = {}){
    this._profile_id = basicSearchINTF._profile_id;
    this.min_date = Number(basicSearchINTF.min_date);
  }
}