import { IsLatitude, IsLongitude, IsNotEmpty } from 'class-validator'
import { PlaceINTF } from '../../../../shared/modules/database/interfaces/Place/Place.intf'
import { validateOrReject } from 'class-validator';


export class PlaceDTO implements PlaceINTF{
  @IsNotEmpty()
  ig_id:number
  
  facebook_places_id: number
  name: string

  // @IsNotEmpty()
  // @IsLongitude()
  longitude: number

  // @IsNotEmpty()
  // @IsLatitude()
  latitude: number
  
  address: string
  city: string
  short_name: string

  constructor(placeINTF: PlaceINTF){
    this.ig_id = placeINTF.ig_id
    this.facebook_places_id = placeINTF.facebook_places_id
    this.name = placeINTF.name
    this.longitude = placeINTF.longitude
    this.latitude = placeINTF.latitude
    this.address = placeINTF.address
    this.city = placeINTF.city
    this.short_name = placeINTF.short_name

    this.validateMembers()
  }

  validateMembers(){
    validateOrReject(this).catch(errors => {
      console.log('Promise rejected (validation failed). Errors: ', errors);
    });
  }
}