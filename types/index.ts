import {
  Account,
  Follower,
  FriendRequest,
  Game,
  GameBody,
  Media,
  Organization,
  OrganizationFollower,
  OrganizationMember,
  Post,
  User,
  UserGame,
} from "@prisma/client";

export type FullUserType = User & {
  account: Account[] | null;
  followers: Follower[] | null;
  followings: Follower[] | null;
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

export type FullPostType = Post & {
  user?: User;
  organization?: Organization
  attachments?: Media[]
}