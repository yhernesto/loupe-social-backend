import { Injectable, UnauthorizedException } from "@nestjs/common";
// import { ModuleRef } from "@nestjs/core";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { UserINTF } from "src/users/database/interface/User.intf";
import { AuthService } from "../auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){
  constructor(private readonly authService: AuthService){
    super({ usernameField: 'email' })
  }
  
  async validate(email: string, password: string): Promise<UserINTF>{
    const user = await this.authService.validateUser(email, password)
    if(!user){
      throw new UnauthorizedException()
    }

    return user
  }
}