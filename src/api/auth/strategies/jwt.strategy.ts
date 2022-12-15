import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserINTF } from "src/users/database/interface/User.intf";
import { UsersService } from "src/users/users.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
  constructor(private readonly userService: UsersService, private readonly configService: ConfigService){
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'mysecretejwtpassword'
    })
  }

  async validate(validationPayload: { email: string, sub: string }): Promise<UserINTF> | null {
    return await this.userService.findOne({ email: validationPayload.email })
  }

}