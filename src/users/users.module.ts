import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './database/schema/user.schema'
import { Client, ClientSchema } from './database/schema/client.schema'
import { CloudStorageModule } from 'src/third-party-apis/Google/cloud-storage/cloud-storage.module';

@Module({
  imports: [
    CloudStorageModule,
    MongooseModule.forFeature([
      { 
        name: User.name, 
        schema: UserSchema 
      },
      { 
        name: Client.name, 
        schema: ClientSchema 
      }
    ]
  )],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
