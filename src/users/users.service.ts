import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { CloudStorageService } from 'src/third-party-apis/Google/cloud-storage/cloud-storage.service';
import { CreateUserDTO } from './database/interface/CreateUser.dto';
import { UpdateUserDTO } from './database/interface/UpdateUser.dto';
import { Client, ClientDocument } from './database/schema/client.schema';
import { User, UserDocument } from './database/schema/user.schema'

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Client.name) private clientModel: Model<ClientDocument>,
    private cloudStorageService: CloudStorageService,
    private configService: ConfigService
  ){}

  async findOne(userFilterQuery: FilterQuery<User>): Promise<User> | undefined {
    return this.userModel.findOne(userFilterQuery as Record<string, unknown>).populate('client')
  }

  async findUsers(): Promise<User[]>{
    return await this.userModel.find({})
  }

  async findClients(): Promise<Client[]>{
    try{
      return await this.clientModel.find({active: true}).populate('ig_official_profile')
    }catch(e){ throw e }
  }

  async findClient(name: string): Promise<Client>{
    try{
      return await this.clientModel.findOne({name: name}).populate('ig_official_profile')
    }catch(e){ throw e }
  }

  async create(user: CreateUserDTO): Promise<User> {
    const user_created = new this.userModel(user)
    return user_created.save()
  }

  async findOneAndUpdate(userFilterQuery: FilterQuery<User>, user: Partial<User>): Promise<User>{
    try{
      return await this.userModel.findOneAndUpdate(userFilterQuery as Record<string, unknown>, user, { new: true })
    }catch(e){ throw e }
  }

  async updateProfilePhoto(file: Express.Multer.File, email: string): Promise<User>{
    try{
      await this.cloudStorageService.uploadFile(file)
      const fileUrl = "https://storage.googleapis.com/" + this.configService.get<string>('GCS_STORAGE_MEDIA_BUCKET') + '/' + file.filename
      const updateUserDTO: UpdateUserDTO = { photo_url: fileUrl }
      return await this.findOneAndUpdate({email}, updateUserDTO)
    }catch(e){ throw e }
  }
}
