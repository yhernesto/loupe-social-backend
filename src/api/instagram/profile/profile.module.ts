import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { db_ProfileService } from 'src/shared/modules/database/db_profile.service';
import { DatabaseModule } from 'src/shared/modules/database/database.module';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';


@Module({
  imports: [DatabaseModule],
  controllers: [ProfileController],
  providers: [ProfileService, db_ProfileService, 
    // {provide: APP_GUARD, useClass: JwtAuthGuard}
  ]

})
export class ProfileModule {}
