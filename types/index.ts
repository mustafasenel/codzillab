import {
  Account,
  Follower,
  FriendRequest,
  Game,
  GameBody,
  Organization,
  OrganizationFollower,
  OrganizationMember,
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