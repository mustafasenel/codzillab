import {
  Account,
  Comment,
  Follower,
  FriendRequest,
  Game,
  GameBody,
  Like,
  Media,
  Notification,
  Organization,
  OrganizationFollower,
  OrganizationMember,
  Post,
  PostTag,
  Tag,
  User,
  UserGame,
} from "@prisma/client";

export type FullUserType = User & {
  account: Account[] | null;
  followers: Follower[] | null;
  followings: Follower[] | null;
  organizationFollowers: OrganizationFollower[] |null;
  friendRequestSent: FullFriendRequestType[] | [];
  friendRequestReceived: FullFriendRequestType[] | [];
  UserGames: FullUserGameType[] | []
};

export type FullFriendRequestType = FriendRequest & {
    requester: FullUserType;
    recipient: FullUserType
}

export type FullGameBodyType = GameBody & {
  user: User;
  game: Game;
};

export type FullUserGameType = UserGame & {
  user?: FullUserType;
  game?: Game
}

export type FullOrganizationType = Organization & {
  members?: OrganizationMember[];
  followers?: OrganizationFollower[];
}

export type FullLikeType = Like & {
  user?: User
}

export type FullPostType = Post & {
  user?: User;
  organization?: Organization
  attachments?: Media[];
  likes?:FullLikeType[]
}

export type FullCommentType = Comment & {
  user?: User;
  likes?:FullLikeType[]
}

export type FullTagType = Tag & {
  posts: PostTag[] 
}

export type FullNotificationType = Notification & {
  post: Post;
  actor: User
}