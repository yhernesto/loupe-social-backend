export const RapidApi = {
  PSADBRO: {  //provider
    HASHTAG: {   //source_type
      ENDPOINT_NAME: 'hashtag_post',
      MAX_CALLS: 2
    },
    PROFILE: {
      USER_INFO_EP_NAME: 'email_and_details',
      USER_POSTS_EP_NAME: 'user_posts'
    }
  },
  KIRTAN: {  //provider
    HASHTAG: {   //source_type
      ENDPOINT_NAME: 'clients/api/ig/media_by_tag',
      MAX_CALLS: 2
    },
    PROFILE: {
      USER_INFO_EP_NAME: 'clients/api/ig/ig_profile',
      USER_POSTS_EP_NAME: 'clients/api/ig/ig_profile',
      USER_FEED_EP_NAME: 'clients/api/ig/feeds',
      USER_COMMENTS_EP_NAME: 'clients/api/ig/commenter_by_media',
      USER_TAGGED_EP_NAME: 'clients/api/ig/tagged'
    }
  }
}

export const Dashboard = {
  RIVALS: {
    GRAPH_POINTS: 10
  },
  STATS: {
    GRAPH_POINTS: 10
  }
}

export const MIN_LIKES_TO_BE_INFLUENCER = 99