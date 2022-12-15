import { Module } from '@nestjs/common';
import { InstagramModule } from 'src/instagram/instagram.module';
import { UsersModule } from 'src/users/users.module';
import { DatabaseModule } from '../database/database.module';
import { DatabaseService } from '../database/database.service';
import { SystemService } from './system.service';

@Module({
  imports: [DatabaseModule, UsersModule, InstagramModule],
  providers: [SystemService, DatabaseService, UsersModule, InstagramModule],
  exports: [SystemService]
})
export class SystemModule {}
