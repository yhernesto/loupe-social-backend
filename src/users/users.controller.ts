import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserINTF } from './database/interface/User.intf'
import { CreateUserDTO } from './database/interface/CreateUser.dto';
import { UpdateUserDTO } from './database/interface/UpdateUser.dto';
import { ValidationPipe } from './pipes/validation.pipe';
import * as bcryptjs from 'bcryptjs';

@Controller('users')
export class UsersController {
  readonly SALT_ROUNDS = 10

  constructor(
    private readonly userService: UsersService
  ){}

  @Get(':email')
  async getUserByEmail(@Param('email') email: string): Promise<UserINTF>{
    return this.userService.findOne({email})
  }

  @Get()
  async getUsers(): Promise<UserINTF[]>{
    return this.userService.findUsers()
  }

  @Post()
  async createUser(@Body(new ValidationPipe()) userDTO: CreateUserDTO): Promise<UserINTF>{
    userDTO.password = await bcryptjs.hash(userDTO.password, this.SALT_ROUNDS);
    const createdUser = await this.userService.create(userDTO)
    return createdUser
  }

  @Patch(':email')
  async patchUser(@Param('email') email: string, @Body() updateUserDTO: UpdateUserDTO): Promise<UserINTF>{
    if(updateUserDTO?.password){
      updateUserDTO.password = await bcryptjs.hash(updateUserDTO.password, this.SALT_ROUNDS);
    }
    return this.userService.findOneAndUpdate({email}, updateUserDTO)
  }

  @Post('/test')
  async test(): Promise<void>{
    try{
      const cl = await this.userService.findClients()
      cl.forEach(clt => {
        console.log(clt)
      })
    }catch(e){
      throw e
    }
  }
}

//{
//    "email": "demo@appeiron.com",
//    "user_name": "demo1"
//}  
