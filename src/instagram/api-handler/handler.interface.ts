// source: https://refactoring.guru/design-patterns/chain-of-responsibility/typescript/example

interface Handler {
  setNext(handler: Handler): Handler;
  getHashtagData(hashtag: string): Promise<any>;
  getProfileData(user_id: number, username: string): Promise<any>;
  getProfilePostsData(username: string): Promise<any>;
  getProfileFeedData(callsCounter: number, username: string): Promise<any>
  getProfileCommentsData(mediaId: string): Promise<any>
}