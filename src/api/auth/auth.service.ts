import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserINTF } from 'src/users/database/interface/User.intf';
import { UsersService } from 'src/users/users.service';
import { ValidateUserDTO as LoginUserDTO } from './interfaces/ValidateUser.dto';
import * as bcryptjs from 'bcryptjs';
import { UpdateUserDTO } from 'src/users/database/interface/UpdateUser.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private configService: ConfigService,
    private readonly jwtService: JwtService
  ){}

  async validateUser(email: string, password: string): Promise<UserINTF> | undefined {
    const user = await this.userService.findOne({ email: email })
    if(!user){
      return null
    }

    const passwordIsValid = await bcryptjs.compare(password, user.password);
    return passwordIsValid ? user : null
  }

  async login(loginUserDTO: LoginUserDTO): Promise<{ access_token : string }> {
    const payload = {
      email: loginUserDTO.email,
      password: loginUserDTO.password
    }

    return {
      access_token: this.jwtService.sign(payload)
    }
  }

  async verify(token: string): Promise<UserINTF>{
    const decodedUser: LoginUserDTO = this.jwtService.verify(token, {
      secret: this.configService.get<string>('JWT_SECRET')
    })
    const user = await this.userService.findOne({email: decodedUser.email})
    return user
  }

  async updateUser(params: {email: string, updateUserDTO: UpdateUserDTO}): Promise<UserINTF>{
    const {email, updateUserDTO} = params
    try{
      return await this.userService.findOneAndUpdate({email}, updateUserDTO)
    }catch(e){
      throw e
    }
  }
}
