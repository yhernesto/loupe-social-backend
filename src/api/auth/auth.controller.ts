import { Body, Controller, Get, Param, Patch, Post, Req, UploadedFile, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { Request } from 'express'
import { UpdateUserDTO } from 'src/users/database/interface/UpdateUser.dto';
import { UserINTF } from 'src/users/database/interface/User.intf';
import { AuthService } from './auth.service';
import { SkipAuth } from './decorators/skipAuth.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import * as bcryptjs from 'bcryptjs';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, getExtension } from 'src/shared/utils/Utils';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { LoggingInterceptor } from '../interceptors/logging.interceptor';

@UseInterceptors(LoggingInterceptor)
@Controller('api/auth')
export class AuthController {
  readonly SALT_ROUNDS = 10

  constructor(private readonly authService: AuthService, 
    private configService: ConfigService,
    private userService: UsersService){}

  @UseGuards(LocalAuthGuard)
  @SkipAuth()
  @Post('login')
  async login(@Req() request: Request): Promise<{ access_token: string }>{
    return await this.authService.login(request.user as UserINTF)
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() request: Request) {
    return request.user;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':email')
  async patchUser(@Param('email') email: string, @Body(new ValidationPipe()) updateUserDTO: UpdateUserDTO): Promise<UserINTF>{
    console.info('updating User: ' + email + ' with data: ' + JSON.stringify(updateUserDTO))
    try{
      if(updateUserDTO?.password){
        updateUserDTO.password = await bcryptjs.hash(updateUserDTO.password, this.SALT_ROUNDS);
      }
      return await this.authService.updateUser({email: email, updateUserDTO: updateUserDTO})
    }catch(e){
      throw e
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch('upload/:email')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        filename: editFileName,
      }),
    }),
  )
  async updateProfilePhoto(@UploadedFile() file: Express.Multer.File, @Param('email') email: string): Promise<UserINTF> {
    file.filename = "users_photos/" + email.split('@')[0] + "." + getExtension(file.originalname)
    return this.userService.updateProfilePhoto(file, email)
  }
}
