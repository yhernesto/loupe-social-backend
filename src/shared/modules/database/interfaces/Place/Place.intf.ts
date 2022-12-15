import { Schema } from 'mongoose';

export interface PlaceINTF{
  _id?: Schema.Types.ObjectId
  ig_id:number,
  facebook_places_id: number,
  name: string,
  longitude: number,
  latitude: number,
  address: string,
  city: string,
  short_name: string,
}