import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Ig_HashtagPost, Ig_HashtagPostSchema } from './schemas/ig-hashtagPost.schema';
import { Ig_hashtagLog, Ig_hashtagLogSchema } from './schemas/ig-hashtagLog.schema';
import { Ig_hashtagRelationLog, Ig_hashtagRelationLogSchema } from './schemas/ig-hashtagRelationLog.schema';
import { Ig_profile, Ig_profileSchema } from './schemas/ig-profile.schema'
import { Ig_profileStatsLog, Ig_profileStatsLogSchema } from './schemas/ig-profileStatsLog.schema'
import { Ig_tag, Ig_tagSchema } from './schemas/ig-tag.schema'
import { Ig_place, Ig_placeSchema } from './schemas/ig-place.schema'
import { Ig_comment, Ig_commentSchema } from './schemas/ig-comment.schema'
import { Ig_profilePost, Ig_profilePostSchema } from './schemas/ig-profilePost.schema';
import { Db_HashtagService } from './db_hashtag.service';
import { WebFeeds_Topics, WebFeeds_topicsSchema } from './schemas/webFeeds_topics.schema';
import { Country, CountrySchema } from './schemas/country.schema';
import { WebFeeds_countryLangSchema, WebFeeds_countryLang } from './schemas/webFeeds_countryLang.schema';
import { db_ProfileService } from './db_profile.service';
import { Ig_profilePostStatsLog, Ig_profilePostStatsLogSchema } from './schemas/ig-profilePostStatsLog.schema';
import { Ig_hashtagRival, HashtagRivalSchema } from './schemas/ig-hashtagRivals.schema';
import { Ig_Hashtag, Ig_hashtagSchema } from './schemas/ig-hashtag.schema';
import { CloudLoggingModule } from 'src/third-party-apis/Google/cloud-logging/cloud-logging.module';
import { CloudLoggingService } from 'src/third-party-apis/Google/cloud-logging/cloud-logging.service';
import { Ig_influencer, Ig_influencerSchema } from './schemas/ig-influencers.schema';
import { Sys_hashtagPostsLog, Sys_hashtagPostsLogSchema } from './schemas/sys-hashtagPostsLog.schema';
import { Sys_profileLog, Sys_profileLogSchema } from './schemas/sys-profileLog.schema';
import { Sys_profilePostsLog, Sys_profilePostsLogSchema } from './schemas/sys-profilePostsLog.schema';
import { Sys_tagPostsLog, Sys_tagPostsLogSchema } from './schemas/sys-tagPostsLog.schema';
import { Sys_profileCommentsLog, Sys_profileCommentsLogSchema } from './schemas/sys-profileCommentsLog.schema';
import { Ig_tagPost, Ig_tagPostSchema } from './schemas/ig-tagPost.schema';

export const Countries = {
  provide: 'COUNTRIES',
  useFactory: async (DatabaseService) => await DatabaseService.getCountries(), 
  inject: [DatabaseService]
};

@Module({
  imports: [    
    MongooseModule.forFeature([
      {
        name: Ig_Hashtag.name,
        schema: Ig_hashtagSchema
      },
      {
        name: Ig_hashtagRival.name,
        schema: HashtagRivalSchema
      },
      { 
        name: Ig_HashtagPost.name, 
        schema: Ig_HashtagPostSchema 
      },
      {
        name: Ig_hashtagLog.name,
        schema: Ig_hashtagLogSchema,
      },
      {
        name: Ig_hashtagRelationLog.name,
        schema: Ig_hashtagRelationLogSchema,
      },
      {
        name: Ig_profile.name,
        schema: Ig_profileSchema,
      },
      {
        name: Ig_profileStatsLog.name,
        schema: Ig_profileStatsLogSchema,
      },
      {
        name: Ig_tag.name,
        schema: Ig_tagSchema,
      },
      {
        name: Ig_place.name,
        schema: Ig_placeSchema,
      },
      {
        name: Ig_comment.name,
        schema: Ig_commentSchema
      },
      {
        name: Ig_profilePost.name,
        schema: Ig_profilePostSchema
      },
      {
        name: Ig_tagPost.name,
        schema: Ig_tagPostSchema
      },
      {
        name: Ig_profilePostStatsLog.name,
        schema: Ig_profilePostStatsLogSchema
      },
      {
        name: WebFeeds_Topics.name,
        schema: WebFeeds_topicsSchema
      },
      {
        name: Country.name,
        schema: CountrySchema
      },
      {
        name: WebFeeds_countryLang.name,
        schema: WebFeeds_countryLangSchema
      },
      {
        name: Ig_influencer.name,
        schema: Ig_influencerSchema
      },
      {
        name: Sys_hashtagPostsLog.name,
        schema: Sys_hashtagPostsLogSchema
      },
      {
        name: Sys_profileLog.name,
        schema: Sys_profileLogSchema
      },
      {
        name: Sys_profilePostsLog.name,
        schema: Sys_profilePostsLogSchema
      },
      {
        name: Sys_tagPostsLog.name,
        schema: Sys_tagPostsLogSchema
      },
      {
        name: Sys_profileCommentsLog.name,
        schema: Sys_profileCommentsLogSchema
      }
    ]),
    CloudLoggingModule
  ],
  providers: [DatabaseService, Db_HashtagService, Countries, db_ProfileService, CloudLoggingService], 
  exports: [DatabaseService, Db_HashtagService, MongooseModule, Countries, db_ProfileService]
})
export class DatabaseModule {}
